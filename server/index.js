require('dotenv').config()
const utils = require('./utils')
const middlewares = require('./middlewares')
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const maju = require('maju')
const requestIp = require('request-ip')
const uid = require('randomstring')

const ADMIN_TOKEN_TIMEOUT = 1000 * 60 * 60 // 1h
const LOGIN_RATE_LIMIT = 10 * 1000 // 10s

const apiPort = process.env.API_PORT || 5000
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
  `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?authMechanism=DEFAULT&authSource=${process.env.MONGO_DATABASE}`

MongoClient.connect(mongoUrl, {
  useNewUrlParser: true
}, (err, client) => {
  if (err) throw err
  initApi(client)
})

function initApi (mongoClient) {
  const api = express()
  api.use(bodyParser.json())
  api.use(requestIp.mw())

  api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  api.use('/api/poll/:pollId', middlewares.pollExists(mongoClient))
  api.get('/api/poll/:pollId', async (req, res) => {
    const poll = req.poll
    const hasPollEnded = poll.settings && poll.settings.endDate ? hasEnded(poll.settings.endDate) : false
    res.json({
      question: poll.question,
      options: poll.options,
      hasEnded: hasPollEnded
    })
  })

  api.use('/api/results/:pollId', middlewares.pollExists(mongoClient))
  api.get('/api/results/:pollId', async (req, res) => {
    const votesCollection = mongoClient.db(process.env.MONGO_DATABASE).collection('votes')
    const votes = await votesCollection.find({ pollId: req.params.pollId }).toArray()

    const majuPoll = maju(req.poll.options)
    votes.forEach(vote => majuPoll.vote(vote.values))
    res.json({
      ratios: majuPoll.getScoreRatio(),
      winner: majuPoll.getWinner(),
      sortedOptions: majuPoll.getSortedOptions().options,
      voteCount: majuPoll.getVotes().length
    })
  })

  api.use('/api/new', middlewares.recaptcha)
  api.post('/api/new', async (req, res) => {
    if (!utils.isValidPoll(req.body)) {
      return res.status(400).json({
        message: `invalid.payload`,
        payload: req.body
      })
    }

    const polls = mongoClient.db(process.env.MONGO_DATABASE).collection('polls')
    const newUid = await utils.getUid(polls)
    await polls.insertOne({
      question: req.body.question,
      options: req.body.options,
      uid: newUid,
      settings: req.body.settings
    })
    res.json({
      uid: newUid
    })
  })

  api.use('/api/vote/:pollId', middlewares.recaptcha)
  api.use('/api/vote/:pollId', middlewares.pollExists(mongoClient))
  api.post('/api/vote/:pollId', async (req, res) => {
    const db = mongoClient.db(process.env.MONGO_DATABASE)
    const poll = req.poll

    if (poll.settings && poll.settings.endDate && hasEnded(poll.settings.endDate)) {
      return res.status(410).json({
        message: 'This poll does not accept votes anymore'
      })
    }

    if (!utils.stringArrayEqual(Object.keys(req.body.vote).sort(), poll.options.sort())) {
      return res.status(400).json({
        message: 'Given vote doesnt match available poll options.'
      })
    }

    const votes = db.collection('votes')
    const response = await votes.insertOne({
      date: new Date(),
      pollId: req.params.pollId,
      values: req.body.vote,
      fingerprint: req.body.fingerprint,
      ip: req.clientIp
    })
    res.json({
      message: 'ok'
    })
  })

  let loginQueue = []
  let adminTokens = []
  api.use('/api/login', middlewares.recaptcha)
  api.post('/api/login', async (req, res) => {
    // rate limiting
    const clientIp = req.clientIp
    if (loginQueue.includes(clientIp)) return res.status(429).json({ message: 'rate.limited' })
    loginQueue.push(clientIp)
    setTimeout(() => {
      loginQueue = loginQueue.filter(ip => ip !== clientIp)
    }, LOGIN_RATE_LIMIT)

    // password validation
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'invalid.password' })
    }

    // deliver access token
    const token = uid.generate({
      length: 20,
      charset: 'alphanumeric'
    })
    adminTokens.push(token)
    setTimeout(() => {
      adminTokens = adminTokens.filter(adminToken => adminToken !== token)
    }, ADMIN_TOKEN_TIMEOUT) // remove token after 1h
    res.json({ token })
  })
  api.listen(apiPort, () => console.log(`API listening on port ${apiPort}`))
}

function hasEnded (endDate) {
  return +new Date() > +new Date(endDate)
}

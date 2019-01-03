const maju = require('maju')
const middlewares = require('../middlewares')
const utils = require('../utils')

module.exports = ({api, mongoClient}) => {
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
    const pollId = req.params.pollId
    const votesCollection = mongoClient.db(process.env.MONGO_DATABASE).collection('votes')
    const votes = await votesCollection.find({ pollId }).toArray()

    const majuPoll = maju(req.poll.options)
    votes.forEach(vote => majuPoll.vote(vote.values))
    res.json({
      id: pollId,
      ratios: majuPoll.getScoreRatio(),
      winner: majuPoll.getWinner(),
      sortedOptions: majuPoll.getSortedOptions().options,
      voteCount: majuPoll.getVotes().length
    })
  })

  api.use('/api/new', middlewares.recaptcha(mongoClient))
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
      date: new Date(),
      question: req.body.question,
      options: req.body.options,
      uid: newUid,
      settings: req.body.settings
    }, { checkKeys: false })
    res.json({
      uid: newUid
    })
  })

  api.use('/api/vote/:pollId', middlewares.recaptcha(mongoClient))
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
    }, { checkKeys: false })
    res.json({
      message: 'ok'
    })
  })
}

function hasEnded(endDate) {
  return +new Date() > +new Date(endDate)
}

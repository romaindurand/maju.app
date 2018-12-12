const middlewares = require('../middlewares')
const uid = require('randomstring')

const ADMIN_TOKEN_TIMEOUT = 1000 * 60 * 60 // 1h
const LOGIN_RATE_LIMIT = 10 * 1000 // 10s

module.exports = ({api, mongoClient, logEvent}) => {
  let loginQueue = []
  let adminTokens = []
  const db = mongoClient.db(process.env.MONGO_DATABASE)

  api.use('/api/login', middlewares.recaptcha(mongoClient))
  api.post('/api/login', async (req, res) => {
    // rate limiting
    const clientIp = req.clientIp
    if (loginQueue.includes(clientIp)) {
      logEvent('rate.limited', {
        ip: clientIp,
        passwordValue: req.body.password
      })
      return res.status(429).json({ message: 'rate.limited' })
    }
    loginQueue.push(clientIp)
    setTimeout(() => {
      loginQueue = loginQueue.filter(ip => ip !== clientIp)
    }, LOGIN_RATE_LIMIT)

    // password validation
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      logEvent('invalid.password', {
        ip: clientIp,
        passwordValue: req.body.password
      })
      return res.status(401).json({ message: 'invalid.password' })
    }

    // deliver access token
    const token = uid.generate({
      length: 20,
      charset: 'alphanumeric'
    })
    adminTokens.push(token)
    logEvent('admin.login', { ip: clientIp })
    setTimeout(() => {
      adminTokens = adminTokens.filter(adminToken => adminToken !== token)
    }, ADMIN_TOKEN_TIMEOUT) // remove token after 1h
    res.json({ token })
  })

  api.use('/api/admin/polls', middlewares.parseCookie)
  api.use('/api/admin/polls', middlewares.authToken(adminTokens, mongoClient))
  api.get('/api/admin/polls', async (req, res) => {
    const pollsCollection = db.collection('polls')
    const votesCollection = db.collection('votes')
    const polls = await pollsCollection.find({}).toArray()
    const voteCounts = await Promise.all(polls.map(poll => votesCollection.countDocuments({ pollId: poll.uid })))
    const pollsWithCounts = polls.map((poll, index) => ({...poll, voteCount: voteCounts[index]}))
    res.json(pollsWithCounts)
  })

  api.use('/api/admin/poll/:pollId', middlewares.parseCookie)
  api.use('/api/admin/poll/:pollId', middlewares.authToken(adminTokens, mongoClient))
  api.delete('/api/admin/poll/:pollId', async (req, res) => {
    const pollsCollection = db.collection('polls')
    const votesCollection = db.collection('votes')
    const pollId = req.params.pollId
    const deletePollRes = await pollsCollection.deleteOne({ uid: pollId })
    const deleteVotesRes = await votesCollection.deleteMany({ pollId })
    res.json({
      deletePollRes,
      deleteVotesRes
    })
  })

  api.use('/api/admin/logs', middlewares.parseCookie)
  api.use('/api/admin/logs', middlewares.authToken(adminTokens, mongoClient))
  api.get('/api/admin/logs', async (req, res) => {
    const logsCollection = db.collection('logs')
    const logs = await logsCollection.find({}).toArray()
    res.json(logs)
  })
}

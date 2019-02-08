const utils = require('./utils')
const logs = require('./logs')

module.exports = {
  recaptcha: (mongoClient) => async (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') return next()
    if (req.poll && req.poll.settings.testMode) return next()

    const isRecaptchaValid = await utils.isValidRecaptchaToken(req.body.token)
    if (isRecaptchaValid) return next()
    logs(mongoClient).logEvent('invalid.recaptcha.token', { ip: req.clientIp, token: req.body.token })
    return res.status(401).json({ message: 'invalid.recaptcha.token' })
  },

  pollExists: (mongoClient) => async (req, res, next) => {
    const db = mongoClient.db(process.env.MONGO_DATABASE)
    const polls = db.collection('polls')
    const poll =  await polls.findOne({ uid: req.params.pollId })
    if (poll)  {
      req.poll = poll
      return next()
    }

    res.status(404).json({ message: 'poll.not.found' })
  },

  parseCookie: async (req, res, next) => {
    if (!req.cookies) {
      req.cookieData = null
      return next()
    }
    try {
      req.cookieData = JSON.parse(req.cookies.maju)
    } catch (ex) {
      req.cookieData = null
    }
    next()
  },

  authToken: (tokenList = [], mongoClient) => async (req, res, next) => {
    const {logEvent} = logs(mongoClient)
    if (!req.cookieData) {
      logEvent('no.auth.cookie', { ip: req.clientIp })
      return res.status(400).json({message: 'no.auth.cookie'})
    }
    const authToken = req.cookieData.auth
    if (!authToken) {
      logEvent('no.auth.token', { ip: req.clientIp })
      return res.status(400).json({message: 'no.auth.token'})
    }
    if (!tokenList.includes(authToken)) {
      logEvent('invalid.auth.token', { ip: req.clientIp, authToken })
      return res.status(400).json({message: 'invalid.auth.token'})
    }
    next()
  }
}

const utils = require('./utils')

module.exports = {
  async recaptcha (req, res, next) {
    if (process.env.NODE_ENV !== 'production') {
      return next()
    }
    const isRecaptchaValid = await utils.isValidRecaptchaToken(req.body.token)
    if (!isRecaptchaValid) return res.status(401).json({ message: 'invalid.recaptcha.token' })
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
  }
}

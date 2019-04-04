require('dotenv').config()
const fs = require('fs-extra')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
  `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?authMechanism=DEFAULT&authSource=${process.env.MONGO_DATABASE}`

MongoClient.connect(mongoUrl, {
  useNewUrlParser: true
}, async (err, client) => {
  if (err) throw err
  const db = client.db(process.env.MONGO_DATABASE)
  const votes = await db.collection('votes').find({}).toArray()
  const polls = await db.collection('polls').find().toArray()
  const migratedVotes = votes.map(vote => {
    const poll = polls.find(poll => poll.uid === vote.pollId)
    const values = []
    poll.options.forEach((option, index) => {
      values[index] = vote.values[option]
    })
    return {
      date: vote.date,
      pollId: vote.pollId,
      fingerprint: vote.fingerprint,
      ip: vote.ip,
      values
    }
  })
  console.log(migratedVotes[0])
  const filename = `${+(new Date())}.json`
  const filepath = path.join(__dirname, filename)
  const votesBackup = votes.map(vote => {
    const tempVote = {...vote}
    delete tempVote._id
    return tempVote
  })
  await fs.writeJson(filepath, votesBackup)
  // todo : create backup script, create "on maintenance" sub-app
  //delete all votes
  //insert migrated votes
  client.close()
})

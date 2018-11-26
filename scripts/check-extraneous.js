require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
  `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?authMechanism=DEFAULT&authSource=${process.env.MONGO_DATABASE}`

MongoClient.connect(mongoUrl, {
  useNewUrlParser: true
}, async (err, client) => {
  if (err) throw err
  const db = client.db(process.env.MONGO_DATABASE)
  const polls = await db.collection('polls').find({}).toArray()
  const pollsId = polls.map(poll => poll.uid)
  const votes = await db.collection('votes').find({}).toArray()
  const orphanVotes = votes.filter(vote => !pollsId.includes(vote.pollId))
  console.log({orphanVotes})
  client.close()
})

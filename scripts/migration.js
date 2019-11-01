require('dotenv').config()
const fs = require('fs-extra')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
  `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?authMechanism=DEFAULT&authSource=${process.env.MONGO_DATABASE}`;

(async function() {
  const { db, close } = await getMongoDb()

  switch(process.argv[2]) {
    case 'backup':
      await backup()
      break;

    case 'restore':
      await restore()
      break;

    case 'empty':
      await empty()
      break;

    case 'migrate':
      await migrate()
      break;

    default:
      console.log('please use one of backup, restore, empty, migrate')
      break;
  }

  process.exit(0)


  async function backup() {
    console.log('creating votes backup ...')
    const votes = await db.collection('votes').find({}).toArray()
    console.log('votes length', votes.length)

    const filename = `votes_backup_${(new Date()).toLocaleString().replace(/[à /:]/g, '_')}.json`
    const filepath = path.join(__dirname, filename)
    const votesBackup = votes.map(vote => {
      const tempVote = {...vote}
      delete tempVote._id
      return tempVote
    })
    console.log('backup length', votesBackup.length)
    await fs.writeJson(filepath, votesBackup)
    console.log(`votes backup created : ${filename}`)
    console.log(`run node scripts/migration.js restore ${filename} to restore this backup`)
    return filename
  }

  async function migrate() {
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

    await empty()
    await insertVotes(migratedVotes)
  }

  async function empty() {
    const backupFilename = await backup()
    console.log('deleting all votes ...')
    const votesCollection = db.collection('votes_new')
    await votesCollection.deleteMany({})
    return backupFilename
  }

  async function restore(filename) {
    const backupFilename = filename || process.argv[3]
    if (!backupFilename) {
      console.log('please provide a file to backup from')
      return
    }
    const backupVotes = await fs.readJSON(path.join(__dirname, backupFilename))
    console.log('backup length', backupVotes.length)
    await insertVotes(backupVotes)
  }

  async function insertVotes(votes) {
    console.log(`inserting ${votes.length} votes`)
    await db.collection('votes_new').insertMany(votes)
  }
})()

function getMongoDb() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, async (err, client) => {
      if (err) reject(err.message)
      else {
        const db = client.db(process.env.MONGO_DATABASE)
        resolve({ db, close: client.close })
      }
    })
  })
}

module.exports = mongoClient => ({
  logEvent(name, data) {
    const db = mongoClient.db(process.env.MONGO_DATABASE)
    const logsCollection = db.collection('logs')
    logsCollection.insertOne({ type: name, ...data, date: new Date()}, { checkKeys: false })
  }
})

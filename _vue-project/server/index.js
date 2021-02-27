require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const MongoClient = require('mongodb').MongoClient
const requestIp = require('request-ip')
const logs = require('./logs')
const publicApi = require('./api/public')

const apiPort = process.env.API_PORT || 5000
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
  `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?authMechanism=DEFAULT&authSource=${process.env.MONGO_DATABASE}`

MongoClient.connect(mongoUrl, {
  useNewUrlParser: true
}, (err, client) => {
  if (err) throw err
  initApi(client)
})
/**
 *
 * @param {MongoClient} mongoClient
 */
function initApi (mongoClient) {
  const {logEvent} = logs(mongoClient)
  const api = express()
  api.use(bodyParser.json())
  api.use(cookieParser())
  api.use(requestIp.mw())

  api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  publicApi({api, mongoClient, logEvent})
  api.listen(apiPort, () => console.log(`API listening on port ${apiPort}`))
}

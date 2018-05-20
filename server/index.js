require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uid = require('uid-safe');
const utils = require('./utils');

const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const api = express();
const apiPort = process.env.API_PORT || 5000;
const nodeEnv = process.env.NODE_ENV || 'dev'

api.use(bodyParser.json());
api.post('/api/new', (req, res) => {
  if (!utils.isValidPoll(req.body)) return res.status(400).json({error: `invalid.payload`, payload: req.body});
  // TODO: create an interface for mongo
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, async (err, client) => {
    const polls = client.db(process.env.MONGO_DATABASE).collection('polls');
    // TODO: check if uid exists in db
    const newUid = await uid(8);
    await polls.insertOne({
      question: req.body.question,
      options: req.body.options,
      uid: newUid
    });
    res.send({ pollId: newUid });
  });
});
api.listen(apiPort, () => console.log(`API listening on port ${apiPort}`));

//serve build folder in production
if (nodeEnv === 'production') {
  const app = express();
  const port = process.env.PORT || 3001;
  app.use(express.static('build'));
  app.listen(port, () => console.log(`App server listening on port ${port}`));
}

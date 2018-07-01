require('dotenv').config();
const utils = require('./utils');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const maju = require('maju');
const apiPort = process.env.API_PORT || 5000;
const nodeEnv = process.env.NODE_ENV || 'dev'
const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
`@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?authMechanism=DEFAULT&authSource=${process.env.MONGO_DATABASE}`;

MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  initApi(client)
});

function initApi (mongoClient) {
  const api = express();
  api.use(bodyParser.json());
  api.get('/api/poll/:pollId', async (req, res) => {
    const polls = mongoClient.db(process.env.MONGO_DATABASE).collection('polls');
    const poll = await polls.findOne({uid: req.params.pollId})
    if (!poll) return res.status(404).json({message: `Poll ID '${req.params.pollId}' does not exist in database`})
    res.json({
      question: poll.question,
      options: poll.options
    });
  })
  api.get('/api/results/:pollId', async (req, res) => {
    const votesCollection = mongoClient.db(process.env.MONGO_DATABASE).collection('votes');
    const pollsCollection = mongoClient.db(process.env.MONGO_DATABASE).collection('polls');
    const [votes, poll] = await Promise.all([
      votesCollection.find({pollId: req.params.pollId}).toArray(),
      pollsCollection.findOne({uid: req.params.pollId})
    ]);
    if (!poll) return res.status(404).json({message: `Poll ID '${req.params.pollId}' does not exist in database`})
    const majuPoll = maju(poll.options);
    votes.forEach(vote => {
      majuPoll.vote(vote.values)
    })
    res.json({
      ratios: majuPoll.getScoreRatio(),
      winner: majuPoll.getWinner(),
      sortedOptions: majuPoll.getSortedOptions().options,
      voteCount: majuPoll.getVotes().length
    });
  })
  api.post('/api/new', async (req, res) => {
    if (!utils.isValidPoll(req.body)) return res.status(400).json({error: `invalid.payload`, payload: req.body});
    const polls = mongoClient.db(process.env.MONGO_DATABASE).collection('polls');
    const newUid = await utils.getUid(polls);
    await polls.insertOne({
      question: req.body.question,
      options: req.body.options,
      uid: newUid,
      votes: []
    });
    res.send({uid: newUid});
  });
  api.post('/api/vote/:pollId', async (req, res) => {
    const db = mongoClient.db(process.env.MONGO_DATABASE)
    const votes = db.collection('votes');
    const response = await votes.insertOne({
      pollId: req.params.pollId,
      values: req.body
    });
    res.json({message: 'ok'});
  });
  api.listen(apiPort, () => console.log(`API listening on port ${apiPort}`));
};

//serve build folder in production
if (nodeEnv === 'production') {
  const app = express();
  const port = process.env.PORT || 3001;
  app.use(express.static('build'));
  app.listen(port, () => console.log(`App server listening on port ${port}`));
}

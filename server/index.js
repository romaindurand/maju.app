const express = require('express');
const bodyParser = require('body-parser');
const api = express();
const apiPort = process.env.API_PORT || 5000;
const nodeEnv = process.env.NODE_ENV || 'dev'

api.use(bodyParser.json());
api.post('/api/new', (req, res) => {
  console.log(req.body)
  res.send({ express: 'Hello From Express' });
});
api.listen(apiPort, () => console.log(`API listening on port ${apiPort}`));

//serve build folder in production
if (nodeEnv === 'production') {
  const app = express();
  const port = process.env.PORT || 3001
  app.use(express.static('build'));
  app.listen(port, () => console.log(`App server listening on port ${port}`))
}
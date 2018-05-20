const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.post('/api/new', (req, res) => {
  console.log(req.body)
  res.send({ express: 'Hello From Express' });
});
app.listen(port, () => console.log(`Listening on port ${port}`));
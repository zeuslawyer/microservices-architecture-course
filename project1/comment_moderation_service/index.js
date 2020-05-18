const express = require('express');
const axios = require('axios').default;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 5003;

app.post('/events', (req, res) => {
  const event = req.body;

  res.send('OK');
});

app.listen(PORT, () => {
  console.info(`Moderator Service listening on port ${PORT}!`);
});

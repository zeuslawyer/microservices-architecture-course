const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

const PORT = 5004;
const posts = {};

/* Get posts + comments */
app.get('/posts', (req, res) => {
  res.send(posts);
});

/* receive events from event bus */
app.post('/events', (req, res) => {});

app.listen(PORT, () => {
  console.info(`Query Service listening on port ${PORT}!`);
});

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const cors = require('cors');

const { handleEvents } = require('./helpers');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5004;

// database
const posts = {};

/* route for queries from front end for posts + comments */
app.get('/posts', (req, res) => {
  res.send(posts);
});

/* handle events received from event bus */
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  const resp = handleEvents(type, data, posts);

  res.send(resp || 'null');
});

app.listen(PORT, async () => {
  console.info(`Query Service listening on port ${PORT}!`);

  // get array of all events from event bus (to handle missed events due to downtime etc)
  const res = await axios.get('http://localhost:5005/event s');

  for (const event of res.data) {
    console.log('processing missed event...', event.type);
    handleEvents(event.type, event.data, posts);
  }
});

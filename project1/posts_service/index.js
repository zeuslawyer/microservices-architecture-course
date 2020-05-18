const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5001;
const posts = {};

app.get('/posts', (_, res) => {
  res.send(posts);
});

/* receive posts at this endpoint */
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  // persist
  const post = { id, title };
  posts[id] = post;

  // emit event to event bus
  await axios.post('http://localhost:5005/events', {
    type: 'PostCreated',
    data: post,
  });

  res.status(201).send(posts[id]);
});

/* receive events from event bus */
app.post('/events', (req, res) => {
  console.log(
    `Comments Service Received Event at ${new Date().toLocaleTimeString()}-`,
    req.body.type
  );
  res.send({});
});

app.listen(PORT, () => {
  console.info(`Posts Service listening on port ${PORT}!`);
});

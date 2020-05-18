const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5004;
const EVENT_TYPES = {
  POST_CREATED: 'PostCreated',
  COMMENT_CREATED: 'CommentCreated',
};

// database
const posts = {};

/* query posts + comments */
app.get('/posts', (req, res) => {
  res.send(posts);
});

/* receive events from event bus */
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  let resp; // response to be returned

  // persist in database
  if (type === EVENT_TYPES.POST_CREATED) {
    const { id, title } = data; // post data shape
    posts[id] = {
      id,
      title,
      comments: [], // initialise  comments as query data shape includes comments prop
    };
    resp = posts[id];
  }

  if (type === EVENT_TYPES.COMMENT_CREATED) {
    const { id, postId, content } = data; // comment data shape
    posts[postId].comments.push({
      id,
      content,
    });
    resp = posts[postId];
  }

  res.send(resp || 'null');
});

app.listen(PORT, () => {
  console.info(`Query Service listening on port ${PORT}!`);
});

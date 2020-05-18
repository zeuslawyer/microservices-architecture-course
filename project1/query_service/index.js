const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5004;

// database
const posts = {};

/* query posts + comments */
app.get('/posts', (req, res) => {
  res.send(posts);
});

/* handle events received from event bus */
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  let resp; // response to be returned

  // handle event and update database
  if (type === 'PostCreated') {
    const { id, title } = data; // post data shape
    posts[id] = {
      id,
      title,
      comments: [], // initialise  comments as query data shape includes comments prop
    };
    resp = posts[id];
  }

  if (type === 'CommentCreated') {
    const { postId, id, content, status } = data; // comment data shape
    posts[postId].comments.push({
      id,
      content,
      status,
    });
    resp = posts[postId];
  }

  if (type === 'CommentUpdated') {
    const { postId, id, status, content } = data; // comment data shape

    // find and update comment in db
    const comment = posts[postId].comments.find((comment) => comment.id === id);

    // update properties of the comment
    comment.status = status;
    comment.content = content;

    resp = posts[postId];
  }

  res.send(resp || 'null');
});

app.listen(PORT, () => {
  console.info(`Query Service listening on port ${PORT}!`);
});

const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const PORT = 5002;
const commentsByPostId = {};

/* get all */
app.get('/comments/all', (_, res) => {
  res.send(commentsByPostId);
});

/* get all comments by postId */
app.get('/posts/:id/comments', (req, res) => {
  const { id: postId } = req.params; // rename as postId

  res.status(201).send(commentsByPostId[postId] || []);
});

/* post a comment to a postId */
app.post('/posts/:id/comments', (req, res) => {
  const { content } = req.body;
  const { id: postId } = req.params; // rename as postId
  const commentId = randomBytes(4).toString('hex');

  if (!commentsByPostId[postId]) commentsByPostId[postId] = [];

  commentsByPostId[postId].push({
    id: commentId,
    content,
  });

  res.status(201).send(commentsByPostId[postId]);
});

app.listen(PORT, () => {
  console.info(`Comments service listening on port ${PORT}!`);
});

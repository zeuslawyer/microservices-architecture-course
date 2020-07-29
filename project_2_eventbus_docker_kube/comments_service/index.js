const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios").default;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5002;
const commentsByPostId = {};

/* get all */
app.get("/comments/all", (_, res) => {
  res.send(commentsByPostId);
});

/* get all comments by postId */
app.get("/posts/:id/comments", (req, res) => {
  const { id: postId } = req.params; // rename as postId

  res.status(201).send(commentsByPostId[postId] || []);
});

/* post a comment to a postId */
app.post("/posts/:id/comments", async (req, res) => {
  const { content } = req.body;
  const { id: postId } = req.params; // rename as postId
  const commentId = randomBytes(4).toString("hex");

  // persist
  if (!commentsByPostId[postId]) commentsByPostId[postId] = [];

  const comment = {
    id: commentId,
    content,
    status: "pending"
  };

  commentsByPostId[postId].push(comment);

  // emit event to event bus
  await axios.post("http://event-bus-clusterip:5005/events", {
    type: "CommentCreated",
    data: { postId, ...comment }
  });

  res.status(201).send(commentsByPostId[postId]);
});

/* receive events from event bus */
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log(`Comments Service Received Event at ${new Date().toLocaleTimeString()}- ${type}.`);

  if (type === "CommentModerated") {
    // update comment in db
    const { postId, id, status, content } = data;

    // find and update the comment in db
    const comment = commentsByPostId[postId].find(comment => comment.id === id);
    comment.status = status;

    // emit update event to event bus
    await axios.post("http://event-bus-clusterip:5005/events", {
      type: "CommentUpdated",
      data: { postId, id, content, status }
    });
  }

  res.send("OK");
});

app.listen(PORT, () => {
  console.info(`Comments service listening on port ${PORT}!`);
});

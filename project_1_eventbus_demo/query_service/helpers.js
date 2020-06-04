function handleEvents(type, data, posts) {
  let resp; // response to be returned

  // handle event and update database
  if (type === "PostCreated") {
    const { id, title } = data; // post data shape
    posts[id] = {
      id,
      title,
      comments: [] // initialise  comments as query data shape includes comments prop
    };
    resp = posts[id];
  }

  if (type === "CommentCreated") {
    const { postId, id, content, status } = data; // comment data shape
    posts[postId].comments.push({
      id,
      content,
      status
    });
    resp = posts[postId];
  }

  if (type === "CommentUpdated") {
    const { postId, id, status, content } = data; // comment data shape

    // find and update comment in db
    const comment = posts[postId].comments.find(comment => comment.id === id);

    // update properties of the comment
    comment.status = status;
    comment.content = content;

    resp = posts[postId];
  }

  return resp;
}
module.exports = { handleEvents };

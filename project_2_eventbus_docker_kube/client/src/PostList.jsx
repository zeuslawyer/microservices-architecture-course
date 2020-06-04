import React from "react";
import axios from "axios";

import { CommentCreate } from "./CommentCreate";
import { CommentList } from "./CommentList";

export const PostList = () => {
  const [posts, setPosts] = React.useState({});

  React.useEffect(() => {
    async function fetch() {
      const res = await axios.get("http://posts.com/posts");
      setPosts(res.data);
    }

    fetch();
  }, []);

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {Object.values(posts).map(post => (
        <div
          key={post.id}
          className="card"
          style={{ width: "30%", marginBottom: "20px" }}
        >
          <div className="card-body">
            <h3>{post.title}</h3>
            <CommentList comments={post.comments} />
            <CommentCreate postId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

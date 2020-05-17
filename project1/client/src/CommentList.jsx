import React from 'react';
import axios from 'axios';

export const CommentList = ({ postId }) => {
  const [comments, setComments] = React.useState([]);

  React.useEffect(() => {
    async function fetch() {
      const { data } = await axios.get(
        `http://localhost:5002/posts/${postId}/comments`
      );
      setComments(data);
    }

    fetch();
  }, []);
  return (
    <ul>
      {comments.map((comment) => {
        return <li key={comment.id}>{comment.content}</li>;
      })}
    </ul>
  );
};

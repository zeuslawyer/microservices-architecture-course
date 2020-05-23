import React from 'react';
import axios from 'axios';

export const CommentCreate = ({ postId }) => {
  const [comment, setComment] = React.useState('');

  const submitComment = async (event) => {
    event.preventDefault();
    if (comment === '') return; // no empty submits
    await axios.post(`http://localhost:5002/posts/${postId}/comments`, {
      content: comment,
    });
    setComment('');
  };

  return (
    <div>
      <form onSubmit={submitComment}>
        <div className='form-group'>
          <label>New Comment:</label>
          <input
            className='form-control'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button className='btn btn-primary'> SUBMIT </button>
      </form>
    </div>
  );
};

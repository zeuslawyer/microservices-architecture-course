import React from 'react';

export const CommentList = ({ comments }) => {
  const renderComments = () => {
    return comments.map((comment) => {
      let content;
      let style;

      if (comment.status === 'approved') content = comment.content;

      if (comment.status === 'pending') {
        content = 'This comment is awaiting moderation.';
        style = { fontStyle: 'italic' };
      }

      if (comment.status === 'rejected') {
        content = 'This comment has been rejected.';
        style = { fontStyle: 'italic' };
      }

      return (
        <li key={comment.id} style={style}>
          {content}
        </li>
      );
    });
  };
  return <ul>{renderComments()}</ul>;
};

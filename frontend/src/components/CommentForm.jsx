import React, { useState } from 'react';

const CommentForm = ({ onAdd, postId }) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ username, content, postId });
    setUsername('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <textarea
        placeholder="Your comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default CommentForm;

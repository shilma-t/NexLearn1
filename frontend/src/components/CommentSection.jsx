import React, { useEffect, useState } from 'react';
import './CommentSection.css';

const API_BASE_URL = "http://localhost:9006/api/comments";

function CommentSection() {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  // Fetch comments on load for postId = 1
  useEffect(() => {
    fetch(`${API_BASE_URL}/post/1`)
      .then(res => res.json())
      .then(data => {
        console.log(data); // Log the response to check its structure
        setComments(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);
  

  // Add or Update comment
  const handleSubmit = (e) => {
    e.preventDefault();

    const commentData = {
      postId: "1", // Hardcoded postId
      username: "Anonymous",
      content,
    };

    const url = editId ? `${API_BASE_URL}/${editId}` : `${API_BASE_URL}`;
    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    })
      .then(res => res.json())
      .then(() => {
        setContent('');
        setEditId(null);
        // Refresh comments after update or add
        return fetch(`${API_BASE_URL}/post/1`)
          .then(res => res.json())
          .then(data => setComments(data));
      })
      .catch(err => console.error('Error:', err));
  };

  const handleEdit = (comment) => {
    setContent(comment.content);
    setEditId(comment.id);
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
      .then(() => {
        setComments(comments.filter(comment => comment.id !== id));
      })
      .catch(err => console.error('Delete error:', err));
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'} Comment</button>
      </form>

      <div className="comment-list">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div>
                <strong>{comment.username}</strong>
                <p>{comment.content}</p>
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(comment)}>✏️ Edit</button>
                <button onClick={() => handleDelete(comment.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;

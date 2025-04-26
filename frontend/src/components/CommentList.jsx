import React, { useState } from 'react';

const CommentList = ({ comments, onUpdate, onDelete }) => {
  const [editId, setEditId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  const handleEdit = (id, content) => {
    setEditId(id);
    setEditedContent(content);
  };

  const handleSave = () => {
    onUpdate(editId, editedContent);
    setEditId(null);
  };

  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>
          <strong>{c.username}</strong>:{" "}
          {editId === c.id ? (
            <input
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            c.content
          )}
          {editId === c.id ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={() => handleEdit(c.id, c.content)}>Edit</button>
          )}
          <button onClick={() => onDelete(c.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;

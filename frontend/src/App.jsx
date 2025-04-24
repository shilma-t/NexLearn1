import React, { useState } from 'react';
import CommentSection from './components/CommentSection';
import './App.css';

function App() {
  const postId = "123"; // Replace with actual postId from your backend if needed
  return (
    <div className="container">
      <h1 className="title">Post Title</h1>
      <p className="subtitle">This is an example post. You can leave comments below 👇</p>
      <CommentSection postId="1"  />
    </div>
  );
}

export default App;

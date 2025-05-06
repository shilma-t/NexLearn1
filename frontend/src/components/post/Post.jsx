import React, { useState } from "react";
import "./post.css";
import { getSession, isLoggedIn } from "../../utils/SessionManager";

export default function Post({ post }) {
  const [showOptions, setShowOptions] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const userInfo = getSession();

  const handleLike = async () => {
    // Like functionality will be handled by the parent Feed component
  };

  const handleComment = async () => {
    // Comment functionality will be handled by the parent Feed component
  };

  const handleDelete = async () => {
    // Delete functionality will be handled by the parent Feed component
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="postCard">
      <div className="postHeader">
        <div className="postUserInfo">
          <img 
            src={post.userProfilePic} 
            alt={post.username} 
            className="userProfilePic"
          />
          <span className="postUsername">{post.username}</span>
        </div>
        {userInfo && post.userId === userInfo.email && (
          <div className="postOptionsWrapper">
            <button
              className="postOptionsBtn"
              onClick={() => setShowOptions(!showOptions)}
            >
              ⋯
            </button>
            {showOptions && (
              <div className="postDropdown">
                <button onClick={handleDelete}>🗑️ Delete</button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="postMediaContainer">
          {post.mediaUrls.map((url, index) => (
            <img 
              key={`${post.id}-media-${index}`} 
              src={url} 
              alt={`Media ${index + 1}`} 
              className="postMedia" 
            />
          ))}
        </div>
      )}

      <div className="postActions">
        <button 
          className={`likeBtn ${post.likedBy?.includes(userInfo?.email) ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {post.likedBy?.includes(userInfo?.email) ? '❤️' : '🤍'} {post.likes || 0}
        </button>
        <button 
          className="commentBtn"
          onClick={toggleComments}
        >
          💬 {post.comments || 0}
        </button>
        <button className="shareBtn">🔗</button>
        <button className="saveBtn">📑</button>
      </div>

      <div className="postCaption">
        <span className="captionUsername">{post.username}</span>
        <span className="captionText">{post.caption}</span>
      </div>

      {showComments && (
        <div className="commentsSection">
          <div className="commentsList">
            {comments.map((comment, idx) => (
              <div key={idx} className="comment">
                <span className="commentUsername">{comment.username}</span>
                <span className="commentContent">{comment.content}</span>
              </div>
            ))}
          </div>
          <div className="commentInput">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleComment();
                }
              }}
            />
            <button 
              onClick={handleComment}
              disabled={!commentText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      )}

      <p className="postTime">
        {new Date(post.timestamp).toLocaleString()}
      </p>
    </div>
  );
} 
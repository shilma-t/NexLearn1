import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";
import Sidebar from "../sidebar/sidebar";
import Rightbar from "../rightbar/Rightbar";

export default function Profile() {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_BASE_URL = "http://localhost:9006/api";
  const POSTS_URL = `${API_BASE_URL}/posts`;
  const COMMENTS_URL = `${API_BASE_URL}/comments`;

  // Get user info from Google session
  const getUserInfo = () => {
    const sessionData = localStorage.getItem('skillhub_user_session');
    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        return {
          userId: userData.email,
          username: userData.name,
          profilePic: userData.picture
        };
      } catch (e) {
        console.error("Error parsing session:", e);
      }
    }
    return null;
  };

  const fetchUserPosts = async () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      setError("Please login to view your profile");
      return;
    }

    try {
      const res = await axios.get(POSTS_URL, {
        withCredentials: true,
      });
      
      if (res.data) {
        // Filter posts for current user and sort by newest first
        const userPosts = res.data
          .filter(post => post.userId === userInfo.userId)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map(post => ({
            ...post,
            comments: 0,
            likes: 0,
            likedBy: []
          }));

        setUserPosts(userPosts);
        setUserInfo(userInfo);

        // Fetch interactions for each post
        const postInteractions = await Promise.all(
          userPosts.map(async (post) => {
            try {
              const commentsRes = await axios.get(`${COMMENTS_URL}/post/${post.id}`, {
                withCredentials: true,
              });
              if (commentsRes.data) {
                const comments = commentsRes.data;
                return {
                  postId: post.id,
                  comments: comments.filter(c => c.type === 'comment'),
                  likes: comments.filter(c => c.type === 'like'),
                  likedBy: comments
                    .filter(c => c.type === 'like')
                    .map(c => c.userId)
                };
              }
            } catch (err) {
              console.error(`Error fetching interactions for post ${post.id}:`, err);
            }
            return {
              postId: post.id,
              comments: [],
              likes: [],
              likedBy: []
            };
          })
        );

        // Update posts with interactions
        setUserPosts(prevPosts => 
          prevPosts.map(post => {
            const interactions = postInteractions.find(i => i.postId === post.id);
            if (interactions) {
              return {
                ...post,
                comments: interactions.comments.length,
                likes: interactions.likes.length,
                likedBy: interactions.likedBy
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError("Failed to fetch your posts. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      const res = await axios.delete(`${POSTS_URL}/${postId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  if (!userInfo) {
    return (
      <div className="appContainer">
        <div className="homeContainer">
          <Sidebar />
          <div className="profile-container">
            <div className="error-message">Please login to view your profile</div>
          </div>
          <Rightbar />
        </div>
      </div>
    );
  }

  return (
    <div className="appContainer">
      <div className="homeContainer">
        <Sidebar />
        <div className="profile-container">
          {error && (
            <div className="error-message" onClick={() => setError(null)}>
              {error}
            </div>
          )}

          <div className="profile-header">
            <div className="profile-pic-container">
              <img 
                src={userInfo.profilePic} 
                alt={userInfo.username} 
                className="profile-pic"
              />
            </div>
            <div className="profile-info">
              <h2 className="username">{userInfo.username}</h2>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{userPosts.length}</span>
                  <span className="stat-label">posts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="posts-grid">
            {userPosts.map((post) => (
              <div key={post.id} className="post-item">
                <div className="post-overlay">
                  <div className="post-stats">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                  <button 
                    className="delete-post"
                    onClick={() => handleDelete(post.id)}
                  >
                    🗑️
                  </button>
                </div>
                {post.mediaUrls && post.mediaUrls[0] && (
                  <img 
                    src={post.mediaUrls[0]} 
                    alt="Post" 
                    className="post-thumbnail"
                  />
                )}
              </div>
            ))}
          </div>

          {userPosts.length === 0 && (
            <div className="no-posts">
              <h3>No Posts Yet</h3>
              <p>Share your first post!</p>
            </div>
          )}
        </div>
        <Rightbar />
      </div>
    </div>
  );
} 
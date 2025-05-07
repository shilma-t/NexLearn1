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
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editMedia, setEditMedia] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({});

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

  const handleEditMediaChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setEditMedia(files);
  };

  const handleEdit = (post) => {
    if (!post.id) {
      setError("Post ID is missing");
      return;
    }
    setEditMode(true);
    setEditPostId(post.id);
    setEditCaption(post.caption || "");
    setEditMedia([]);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!editPostId) {
      setError("Edit post ID is missing");
      return;
    }

    if (!editCaption.trim() && editMedia.length === 0) {
      setError("Please add a caption or media to update");
      return;
    }

    const formData = new FormData();
    formData.append("caption", editCaption);

    if (editMedia.length > 0) {
      editMedia.forEach((file) => {
        formData.append("file", file);
      });
    }

    try {
      const res = await axios.put(
        `${POSTS_URL}/${editPostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data) {
        setEditMode(false);
        setEditPostId(null);
        setEditCaption("");
        setEditMedia([]);
        setError(null);
        fetchUserPosts();
      }
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.response?.data || "Failed to update post. Please try again.");
    }
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

  const handleDelete = async (postId) => {
    try {
      const res = await axios.delete(`${POSTS_URL}/${postId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        setShowPostModal(false);
        setSelectedPost(null);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  const handlePostClick = async (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
    // Fetch comments for the selected post
    try {
      const res = await axios.get(`${COMMENTS_URL}/post/${post.id}`, {
        withCredentials: true,
      });
      if (res.data) {
        const postComments = res.data.filter(c => c.type === 'comment');
        setComments(prev => ({
          ...prev,
          [post.id]: postComments
        }));
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleComment = async (postId) => {
    if (!userInfo) {
      setError("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      setError("Please enter a comment");
      return;
    }

    try {
      const newComment = {
        postId,
        userId: userInfo.userId,
        username: userInfo.username,
        content: commentText,
        type: "comment",
        createdAt: new Date().toISOString()
      };

      const res = await axios.post(COMMENTS_URL, newComment, {
        withCredentials: true,
      });

      if (res.data) {
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), { ...newComment, id: res.data.id }]
        }));

        setUserPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: (post.comments || 0) + 1
              };
            }
            return post;
          })
        );

        setCommentText("");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleLike = async (postId) => {
    if (!userInfo) {
      setError("Please login to like posts");
      return;
    }

    try {
      // Optimistically update UI
      setUserPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likedBy?.includes(userInfo.userId);
            return {
              ...post,
              likes: isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
              likedBy: isLiked 
                ? post.likedBy.filter(id => id !== userInfo.userId)
                : [...(post.likedBy || []), userInfo.userId]
            };
          }
          return post;
        })
      );

      // Then make the API call
      const res = await axios.post(COMMENTS_URL, {
        postId,
        userId: userInfo.userId,
        username: userInfo.username,
        content: "liked this post",
        type: "like"
      }, {
        withCredentials: true,
      });

      if (!res.data) {
        // If the API call fails, refresh the post data
        const commentsRes = await axios.get(`${COMMENTS_URL}/post/${postId}`);
        if (commentsRes.data) {
          const comments = commentsRes.data;
          setUserPosts(prevPosts => 
            prevPosts.map(p => 
              p.id === postId ? {
                ...p,
                likes: comments.filter(c => c.type === 'like').length,
                likedBy: comments
                  .filter(c => c.type === 'like')
                  .map(c => c.userId)
              } : p
            )
          );
        }
      }
    } catch (err) {
      console.error("Error liking post:", err);
      setError("Failed to like post. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

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
              <div 
                key={post.id} 
                className="post-item"
                onClick={() => handlePostClick(post)}
              >
                <div className="post-overlay">
                  <div className="post-stats">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
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

      {showPostModal && selectedPost && (
        <div className="postModalOverlay" onClick={() => setShowPostModal(false)}>
          <div className="postModalContent" onClick={e => e.stopPropagation()}>
            <div className="postModalLeft">
              {selectedPost.mediaUrls && selectedPost.mediaUrls[0] && (
                <img 
                  src={selectedPost.mediaUrls[0]} 
                  alt="Post" 
                  className="postModalImage"
                />
              )}
            </div>
            <div className="postModalRight">
              <div className="postModalHeader">
                <div className="postModalUserInfo">
                  <img 
                    src={userInfo.profilePic} 
                    alt={userInfo.username} 
                    className="postModalUserPic"
                  />
                  <span className="postModalUsername">{userInfo.username}</span>
                </div>
                <div className="postModalActions">
                  <button 
                    className="edit-post"
                    onClick={() => handleEdit(selectedPost)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-post"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this post?")) {
                        handleDelete(selectedPost.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="postModalCaption">
                <span className="captionUsername">{userInfo.username}</span>
                <span className="captionText">{selectedPost.caption}</span>
              </div>
              <div className="postModalInteractions">
                <button 
                  className={`likeBtn ${selectedPost.likedBy?.includes(userInfo.userId) ? 'liked' : ''}`}
                  onClick={() => handleLike(selectedPost.id)}
                >
                  {selectedPost.likedBy?.includes(userInfo.userId) ? '❤️' : '🤍'} {selectedPost.likes || 0}
                </button>
                <span className="postTime">
                  {new Date(selectedPost.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="postModalComments">
                <div className="commentsList">
                  {comments[selectedPost.id]?.map((comment, idx) => (
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
                        handleComment(selectedPost.id);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleComment(selectedPost.id)}
                    disabled={!commentText.trim()}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Edit Post</h3>
            <textarea
              className="shareInput"
              placeholder="Edit your caption"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
            />
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleEditMediaChange}
            />
            <div className="modalActions">
              <button onClick={handleUpdate}>Update Post</button>
              <button className="cancelBtn" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
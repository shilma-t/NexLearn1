import React, { useState, useEffect } from "react";
import "./feed.css";
import axios from "axios";
import CreatePostModal from "../../pages/Posts/CreatePostModal";

export default function Feed() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});

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
    return {
      userId: null,
      username: null,
      profilePic: null
    };
  };

  const { userId, username, profilePic } = getUserInfo();
  const API_BASE_URL = "http://localhost:9006/api";
  const POSTS_URL = `${API_BASE_URL}/posts`;
  const COMMENTS_URL = `${API_BASE_URL}/comments`;

  useEffect(() => {
    const handler = () => setShowCreateModal(true);
    window.addEventListener("open-create-modal", handler);
    return () => window.removeEventListener("open-create-modal", handler);
  }, []);

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    
    // Compress images if they're too large
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        if (file.type.startsWith('image/')) {
          // Create a canvas to compress the image
          const img = new Image();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Create a promise to handle image loading
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = URL.createObjectURL(file);
          });
          
          // Set maximum dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          // Resize the image
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with reduced quality
          const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.7);
          });
          
          return new File([blob], file.name, { type: 'image/jpeg' });
        }
        return file;
      })
    );
    
    setMedia(compressedFiles);
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(POSTS_URL, {
        withCredentials: true,
      });
      if (res.data) {
        // Sort posts by timestamp in descending order (newest first)
        const sortedPosts = res.data.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Set posts immediately with default values and user info
        const postsWithDefaults = sortedPosts.map(post => ({
          ...post,
          comments: 0,
          likes: 0,
          likedBy: [],
          userProfilePic: post.profilePic || 'https://via.placeholder.com/40', // Default profile pic
          username: post.username || 'Anonymous'
        }));
        setPosts(postsWithDefaults);

        // Fetch interactions in smaller batches
        const batchSize = 3;
        for (let i = 0; i < sortedPosts.length; i += batchSize) {
          const batch = sortedPosts.slice(i, i + batchSize);
          await Promise.all(
            batch.map(async (post) => {
              try {
                const commentsRes = await axios.get(`${COMMENTS_URL}/post/${post.id}`, {
                  withCredentials: true,
                });
                if (commentsRes.data) {
                  const comments = commentsRes.data;
                  const postComments = comments.filter(c => c.type === 'comment');
                  const postLikes = comments.filter(c => c.type === 'like');
                  
                  setPosts(prevPosts => 
                    prevPosts.map(p => 
                      p.id === post.id ? {
                        ...p,
                        comments: postComments.length,
                        likes: postLikes.length,
                        likedBy: postLikes.map(c => c.userId)
                      } : p
                    )
                  );

                  setComments(prev => ({
                    ...prev,
                    [post.id]: postComments
                  }));
                }
              } catch (err) {
                console.error(`Error fetching interactions for post ${post.id}:`, err);
              }
            })
          );
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (err.response?.status === 401) {
        setError("Please login to view posts");
      } else {
        setError("Failed to fetch posts. Please try again.");
      }
    }
  };

  const handleShare = async () => {
    if (!userId) {
      setError("Please login to share a post");
      return;
    }

    if (!caption.trim() && media.length === 0) {
      setError("Please add a caption or media to share");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("profilePic", profilePic);

    if (media.length > 0) {
    media.forEach((file) => {
      formData.append("file", file);
    });
    }

    try {
      const res = await axios.post(`${POSTS_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      if (res.data) {
        // Add the new post at the top of the list
        const newPost = {
          ...res.data,
          comments: 0,
          likes: 0,
          likedBy: [],
          userProfilePic: profilePic,
          username: username
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
      setCaption("");
      setMedia([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error posting:", err);
      setError(err.response?.data || "Failed to create post. Please try again.");
    }
  };

  const handleLike = async (postId) => {
    if (!userId) {
      setError("Please login to like posts");
      return;
    }

    try {
      // Optimistically update UI
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likedBy?.includes(userId);
            return {
              ...post,
              likes: isLiked ? (post.likes || 0) - 1 : (post.likes || 0) + 1,
              likedBy: isLiked 
                ? post.likedBy.filter(id => id !== userId)
                : [...(post.likedBy || []), userId]
            };
          }
          return post;
        })
      );

      // Then make the API call
      const res = await axios.post(COMMENTS_URL, {
        postId,
        userId,
        username,
        content: "liked this post",
        type: "like"
      }, {
        withCredentials: true,
      });

      // If the API call fails, refresh the post data
      if (!res.data) {
        const commentsRes = await axios.get(`${COMMENTS_URL}/post/${postId}`);
        if (commentsRes.data) {
          const comments = commentsRes.data;
          setPosts(prevPosts => 
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
      // Refresh post data to ensure UI is in sync with server
      const commentsRes = await axios.get(`${COMMENTS_URL}/post/${postId}`);
      if (commentsRes.data) {
        const comments = commentsRes.data;
        setPosts(prevPosts => 
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
  };

  const handleComment = async (postId) => {
    if (!userId) {
      setError("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      setError("Please enter a comment");
      return;
    }

    try {
      // Create the comment object
      const newComment = {
        postId,
        userId,
        username,
        content: commentText,
        type: "comment",
        createdAt: new Date().toISOString()
      };

      // Make the API call first
      const res = await axios.post(COMMENTS_URL, newComment, {
        withCredentials: true,
      });

      if (res.data) {
        // Add the new comment with its ID from the response
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), { ...newComment, id: res.data.id }]
        }));

        setPosts(prevPosts => 
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

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${COMMENTS_URL}/post/${postId}`, {
        withCredentials: true,
      });
      if (res.data) {
        const postComments = res.data.filter(c => c.type === 'comment');
        setComments(prev => ({
          ...prev,
          [postId]: postComments.map(comment => ({
            ...comment,
            id: comment._id || comment.id // Handle both MongoDB _id and regular id
          }))
        }));
      }
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => {
      const newState = {
        ...prev,
        [postId]: !prev[postId]
      };
      // Fetch comments when opening the comment section
      if (newState[postId]) {
        fetchComments(postId);
      }
      return newState;
    });
  };

  const handleEditComment = async (postId, commentId, newContent) => {
    if (!userId) {
      setError("Please login to edit comments");
      return;
    }

    if (!commentId) {
      setError("Comment ID is missing");
      return;
    }

    try {
      const res = await axios.put(`${COMMENTS_URL}/${commentId}`, {
        content: newContent,
        userId,
        username,
        type: "comment"
      }, {
        withCredentials: true,
      });

      if (res.data) {
        // Update the comment in the UI
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId].map(comment => 
            comment.id === commentId || comment._id === commentId
              ? { ...comment, content: newContent }
              : comment
          )
        }));
      }
    } catch (err) {
      console.error("Error editing comment:", err);
      setError("Failed to edit comment. Please try again.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!userId) {
      setError("Please login to delete comments");
      return;
    }

    try {
      await axios.delete(`${COMMENTS_URL}/${commentId}`, {
        withCredentials: true,
      });

      // Update the comment count and remove the comment from UI
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: (post.comments || 0) - 1
            };
          }
          return post;
        })
      );

      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(comment => comment.id !== commentId)
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment. Please try again.");
    }
  };

  // Add useEffect to fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Add useEffect to fetch posts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPosts();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Add useEffect to fetch comments when showComments changes
  useEffect(() => {
    Object.entries(showComments).forEach(([postId, isVisible]) => {
      if (isVisible && (!comments[postId] || comments[postId].length === 0)) {
        fetchComments(postId);
      }
    });
  }, [showComments]);

  return (
    <div className="feed">
      {error && (
        <div className="error-message" onClick={() => setError(null)}>
          {error}
        </div>
      )}
      <div className="feedWrapper">
        <div className="shareBox">
          <input
            className="shareInput"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
          />
          <button className="shareButton" onClick={handleShare}>
            Share
          </button>
        </div>

        {posts.map((post, index) => (
          <div className="postCard" key={post.id || `post-${index}`}>
            <div className="postHeader">
              <div className="postUserInfo">
                <img 
                  src={post.userProfilePic} 
                  alt={post.username} 
                  className="userProfilePic"
                />
                <span className="postUsername">{post.username}</span>
              </div>
            </div>

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="postMediaContainer">
                {post.mediaUrls.map((url, mediaIndex) => (
                  <img 
                    key={`${post.id}-media-${mediaIndex}`} 
                    src={url} 
                    alt={`Media ${mediaIndex + 1}`} 
                    className="postMedia" 
                  />
                ))}
              </div>
            )}

            <div className="postActions">
              <button 
                className={`likeBtn ${post.likedBy?.includes(userId) ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                {post.likedBy?.includes(userId) ? '❤️' : '🤍'} {post.likes || 0}
              </button>
              <button 
                className="commentBtn"
                onClick={() => toggleComments(post.id)}
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

            {showComments[post.id] && (
              <div className="commentsSection">
                <div className="commentsList">
                  {comments[post.id]?.map((comment, idx) => (
                    <div key={idx} className="comment">
                      <div className="commentHeader">
                        <span className="commentUsername">{comment.username}</span>
                        {comment.userId === userId && (
                          <div className="commentActions">
                            <button
                              className="editCommentBtn"
                              onClick={() => {
                                const newContent = prompt("Edit your comment:", comment.content);
                                if (newContent && newContent.trim() !== comment.content) {
                                  handleEditComment(post.id, comment.id, newContent);
                                }
                              }}
                            >
                              ✏️
                            </button>
                            <button
                              className="deleteCommentBtn"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to delete this comment?")) {
                                  handleDeleteComment(post.id, comment.id);
                                }
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
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
                        handleComment(post.id);
                      }
                    }}
                  />
                  <button 
                    onClick={() => handleComment(post.id)}
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
        ))}
      </div>

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          fetchPosts={fetchPosts}
        />
      )}
    </div>
  );
}
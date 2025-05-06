import React, { useState, useEffect } from "react";
import "./feed.css";
import axios from "axios";
import CreatePostModal from "../../pages/Posts/CreatePostModal";
import Post from "../post/Post";
import Share from "../share/Share";
import { getSession, isLoggedIn } from "../../utils/SessionManager";

export default function Feed() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState([]);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editMedia, setEditMedia] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});

  const API_BASE_URL = "http://localhost:9006/api";
  const POSTS_URL = `${API_BASE_URL}/posts`;
  const COMMENTS_URL = `${API_BASE_URL}/comments`;

  // Get user info from session
  const getUserInfo = () => {
    if (!isLoggedIn()) {
      return null;
    }
    const sessionData = getSession();
    if (sessionData) {
      return {
        userId: sessionData.email,
        username: sessionData.name,
        profilePic: sessionData.picture
      };
    }
    return null;
  };

  const { userId, username, profilePic } = getUserInfo();

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

  const handleEditMediaChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setEditMedia(files);
  };

  const fetchPosts = async () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      setError("Please login to view posts");
      return;
    }

    try {
      const res = await axios.get(POSTS_URL, {
        withCredentials: true,
      });
      
      if (res.data) {
        // Sort posts by newest first and add user info
        const sortedPosts = res.data
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map(post => ({
            ...post,
            comments: 0,
            likes: 0,
            likedBy: [],
            userProfilePic: post.userProfilePic || "https://via.placeholder.com/40",
            username: post.username || "Unknown User"
          }));

        setPosts(sortedPosts);

        // Fetch interactions for each post
        const postInteractions = await Promise.all(
          sortedPosts.map(async (post) => {
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
        setPosts(prevPosts => 
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
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts. Please try again.");
    }
  };

  const handleShare = async (newPost) => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      setError("Please login to share a post");
      return;
    }

    try {
      const res = await axios.post(POSTS_URL, {
        ...newPost,
        userId: userInfo.userId,
        username: userInfo.username,
        userProfilePic: userInfo.profilePic,
        timestamp: new Date().toISOString()
      }, {
        withCredentials: true,
      });

      if (res.data) {
        // Add the new post at the beginning of the list
        setPosts(prevPosts => [{
          ...res.data,
          comments: 0,
          likes: 0,
          likedBy: [],
          userProfilePic: userInfo.profilePic,
          username: userInfo.username
        }, ...prevPosts]);
      }
    } catch (err) {
      console.error("Error sharing post:", err);
      setError("Failed to share post. Please try again.");
    }
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
        fetchPosts();
      }
    } catch (err) {
      console.error("Error updating post:", err);
      setError(err.response?.data || "Failed to update post. Please try again.");
    }
  };

  const handleDelete = async (postId) => {
    if (!postId) {
      setError("Post ID is missing");
      return;
    }

    try {
      const res = await axios.delete(`${POSTS_URL}/${postId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setError(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.response?.data || "Failed to delete post. Please try again.");
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

      // Optimistically update UI
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
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

      // Make the API call
      const res = await axios.post(COMMENTS_URL, newComment, {
        withCredentials: true,
      });

      setCommentText("");

      // Refresh comments to ensure we have the latest data
      if (res.data) {
        const commentsRes = await axios.get(`${COMMENTS_URL}/post/${postId}`);
        if (commentsRes.data) {
          const postComments = commentsRes.data.filter(c => c.type === 'comment');
          setComments(prev => ({
            ...prev,
            [postId]: postComments
          }));
        }
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
      // Refresh comments to ensure UI is in sync with server
      const commentsRes = await axios.get(`${COMMENTS_URL}/post/${postId}`);
      if (commentsRes.data) {
        const postComments = commentsRes.data.filter(c => c.type === 'comment');
        setComments(prev => ({
          ...prev,
          [postId]: postComments
        }));
      }
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
          [postId]: postComments
        }));
      }
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      // Don't show error to user, just keep existing comments
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

  if (!getUserInfo()) {
    return (
      <div className="feed">
        <div className="error-message">Please login to view posts</div>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feedWrapper">
        {error && (
          <div className="error-message" onClick={() => setError(null)}>
            {error}
          </div>
        )}
        <Share onShare={handleShare} />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
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
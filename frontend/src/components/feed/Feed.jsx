import React, { useState, useEffect } from "react";
import "./feed.css";
import axios from "axios";
import CreatePostModal from "../../pages/Posts/CreatePostModal";

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

  const userId = localStorage.getItem("userId") || "null";
  const username = localStorage.getItem("username") || "null";
  const profilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/40";

  const API_BASE_URL = "http://localhost:9006/api/posts";

  useEffect(() => {
    const handler = () => setShowCreateModal(true);
    window.addEventListener("open-create-modal", handler);
    return () => window.removeEventListener("open-create-modal", handler);
  }, []);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setMedia(files);
  };

  const handleEditMediaChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setEditMedia(files);
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(API_BASE_URL, {
        withCredentials: true,
      });
      if (res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts. Please try again.");
    }
  };

  const handleShare = async () => {
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
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data) {
        setCaption("");
        setMedia([]);
        setError(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Error posting:", err);
      setError(err.response?.data || "Failed to create post. Please try again.");
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
        `${API_BASE_URL}/${editPostId}`,
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
      const res = await axios.delete(`${API_BASE_URL}/${postId}`, {
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

  useEffect(() => {
    fetchPosts();
  }, []);

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
              <div className="postOptionsWrapper">
                <button
                  className="postOptionsBtn"
                  onClick={() =>
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id
                          ? { ...p, showOptions: !p.showOptions }
                          : { ...p, showOptions: false }
                      )
                    )
                  }
                >
                  ⋯
                </button>

                {post.showOptions && (
                  <div className="postDropdown">
                    <button onClick={() => handleEdit(post)}>✏️ Edit</button>
                    <button onClick={() => handleDelete(post.id)}>🗑️ Delete</button>
                  </div>
                )}
              </div>
            </div>

            <p>{post.caption}</p>

            {post.mediaUrls &&
              post.mediaUrls.map((url, mediaIndex) => (
                <img 
                  key={`${post.id}-media-${mediaIndex}`} 
                  src={url} 
                  alt={`Media ${mediaIndex + 1}`} 
                  className="postMedia" 
                />
              ))}

            <div className="postActions">
              <button className="likeBtn">❤️ {post.likes || 0}</button>
              <button className="commentBtn">💬 {post.comments || 0}</button>
              <button className="shareBtn">🔗</button>
              <button className="saveBtn">📑</button>
            </div>

            <p className="postTime">
              {new Date(post.timestamp).toLocaleString()}
            </p>
          </div>
        ))}

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

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          fetchPosts={fetchPosts}
        />
      )}
    </div>
  );
}
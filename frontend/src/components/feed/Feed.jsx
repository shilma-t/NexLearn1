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

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const profilePic =
    localStorage.getItem("profilePic") || "https://via.placeholder.com/40";

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
      const res = await axios.get("http://localhost:9006/api/posts", {
        withCredentials: true, // Optional if session-protected
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleShare = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("profilePic", profilePic);

    media.forEach((file) => {
      formData.append("file", file);
    });

    try {
      await axios.post("http://localhost:9006/api/posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // ✅ Required for session to be sent
      });
      setCaption("");
      setMedia([]);
      fetchPosts();
    } catch (err) {
      console.error("Error posting:", err);
    }
  };

  const handleEdit = (post) => {
    setEditMode(true);
    setEditPostId(post.id);
    setEditCaption(post.caption);
    setEditMedia([]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("caption", editCaption);

    editMedia.forEach((file) => {
      formData.append("file", file);
    });

    try {
      await axios.put(
        `http://localhost:9006/api/posts/${editPostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // ✅ Important for session
        }
      );
      setEditMode(false);
      fetchPosts();
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:9006/api/posts/${postId}`, {
        withCredentials: true, // Optional if delete requires login
      });
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="feed">
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

        {posts.map((post) => (
          <div className="postCard" key={post.id}>
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
              post.mediaUrls.map((url, index) => (
                <img key={index} src={url} alt="Media" className="postMedia" />
              ))}

            <div className="postActions">
              <button className="likeBtn">❤️ {post.likes}</button>
              <button className="commentBtn">💬 {post.comments}</button>
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

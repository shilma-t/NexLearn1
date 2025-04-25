import React, { useState, useEffect } from "react";
import "./feed.css";
import axios from "axios";

export default function Feed() {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState([]);
  const [posts, setPosts] = useState([]);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/40";

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setMedia(files);
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:9006/api/posts");
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
      });
      setCaption("");
      setMedia([]);
      fetchPosts();
    } catch (err) {
      console.error("Error posting:", err);
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
              <img src={post.profilePic} alt="Profile" className="profilePic" />
              <span>{post.username}</span>
            </div>
            <p>{post.caption}</p>
            {post.mediaUrls &&
              post.mediaUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt="Media"
                  className="postMedia"
                  style={{ maxWidth: "100%", marginBottom: "10px" }}
                />
              ))}
            <p className="postTime">
              Posted at: {new Date(post.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

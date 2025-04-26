import React, { useState, useEffect } from "react";
import "./createPostModal.css";
import axios from "axios";

export default function CreatePostModal({ onClose, fetchPosts }) {
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic");

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setMedia(files);
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("username", username);
    formData.append("profilePic", profilePic);
    formData.append("caption", caption);
    formData.append("location", location);

    media.forEach((file) => {
      formData.append("file", file);
    });

    try {
      await axios.post("http://localhost:9006/api/posts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchPosts();
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalBox">
        {step === 1 && (
          <>
            <h3>Select up to 3 media files</h3>
            <input type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} />
            <button onClick={() => setStep(2)} disabled={media.length === 0}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Preview & Apply Filters (Mock)</h3>
            <div className="mediaPreview">
              {media.map((file, idx) => (
                <p key={idx}>{file.name}</p>
              ))}
            </div>
            <button onClick={() => setStep(3)}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Caption & Location</h3>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." />
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
            <div className="modalActions">
              <button onClick={handlePost}>Post</button>
              <button onClick={() => setShowDiscard(true)}>Discard</button>
            </div>
          </>
        )}

        {showDiscard && (
          <div className="discardPopup">
            <p>Are you sure you want to discard this post?</p>
            <button onClick={onClose}>Yes</button>
            <button onClick={() => setShowDiscard(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./createPostModal.css";
import axios from "axios";

export default function CreatePostModal({ onClose, fetchPosts }) {
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState([]);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);
  const [filter, setFilter] = useState("");
  const [filterStrength, setFilterStrength] = useState(1);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

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

  const applyFilter = (filterName) => setFilter(filterName);
  const handleFilterStrengthChange = (e) => setFilterStrength(e.target.value);

  const getFilterStyle = () => {
    if (!filter) return "none";

    const strength = Number(filterStrength);

    switch (filter) {
      case "brightness":
        return `brightness(${strength})`;
      case "grayscale":
        return `grayscale(${strength})`;
      case "contrast":
        return `contrast(${strength})`;
      case "sepia":
        return `sepia(${strength})`;
      default:
        return "none";
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            if (data && data.address) {
              const { city, town, village, state, country } = data.address;
              const placeName = city || town || village || state || country || "Unknown Location";
              setLocation(`${placeName}, ${country}`);
            } else {
              setLocation("Unknown Location");
            }
          } catch (error) {
            console.error("Error fetching place name:", error);
            setLocation("Unknown Location");
          }
          setIsFetchingLocation(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setIsFetchingLocation(false);
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalBox">
        {step === 1 && (
          <>
            <h3 className="modalTitle">Select Media</h3>
            <input type="file" multiple accept="image/*,video/*" onChange={handleMediaChange} />
            <button className="accentBtn" onClick={() => setStep(2)} disabled={media.length === 0}>
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="modalTitle">Edit & Filter</h3>
            <div className="mediaPreview">
              {media.map((file, idx) => (
                <div key={idx} className="mediaItem">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="filterable"
                      style={{ filter: getFilterStyle() }}
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="filterable"
                      style={{ filter: getFilterStyle() }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="filterOptions">
              <button onClick={() => applyFilter("brightness")}>Brightness</button>
              <button onClick={() => applyFilter("grayscale")}>Grayscale</button>
              <button onClick={() => applyFilter("contrast")}>Contrast</button>
              <button onClick={() => applyFilter("sepia")}>Sepia</button>
              <button onClick={() => applyFilter("")}>Reset</button>
            </div>

            <div className="filterStrength">
              <label>Adjust Strength</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.01"
                value={filterStrength}
                onChange={handleFilterStrengthChange}
              />
              <span>{Math.round(filterStrength * 100)}%</span>
            </div>

            <button className="accentBtn" onClick={() => setStep(3)}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="modalTitle">Write a Caption</h3>
            <div className="captionContainer">
              <textarea
                className="captionInput"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
              />
              <input
                className="locationInput"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location manually"
              />
              <button className="accentBtn" onClick={fetchLocation} disabled={isFetchingLocation}>
                {isFetchingLocation ? "Fetching Location..." : "Use Current Location"}
              </button>
            </div>

            <div className="modalActions">
              <button className="accentBtn" onClick={handlePost}>Post</button>
              <button className="discardBtn" onClick={() => setShowDiscardPopup(true)}>Discard</button>
            </div>
          </>
        )}

        {showDiscardPopup && (
          <div className="popupOverlay">
            <div className="popupBox">
              <p>Discard this post?</p>
              <div className="popupActions">
                <button className="accentBtn" onClick={onClose}>Yes</button>
                <button className="discardBtn" onClick={() => setShowDiscardPopup(false)}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

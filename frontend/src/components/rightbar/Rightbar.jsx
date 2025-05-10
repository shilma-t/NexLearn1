import React, { useEffect, useState } from "react";
import "./rightbar.css";

const adImages = [
  "/assets/ad1.jpg",
  "/assets/ad2.jpeg",
  "/assets/ad3.webp"
];

export default function Rightbar() {
  const [currentAd, setCurrentAd] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % adImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="rightbarAd">
          <h4 className="rightbarTitle">Sponsored</h4>
          <div className="ad-carousel">
            {adImages.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`Ad ${idx + 1}`}
                className={`rightbarAdImg ad-slide${currentAd === idx ? " active" : ""}`}
                style={{ display: currentAd === idx ? "block" : "none" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

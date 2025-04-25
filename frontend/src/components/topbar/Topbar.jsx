import React from "react";
import "./topbar.css";

export default function Topbar({ onLogout }) {
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">NexLearn</span>
      </div>
      <div className="topbarCenter">
        <input type="text" placeholder="Search for friend, post or video" className="searchInput" />
      </div>
      <div className="topbarRight">
        <span className="topbarLink">Homepage</span>
        <span className="topbarLink">Timeline</span>
        <div className="topbarIcons">
          <span className="topbarIconBadge">1</span>
          <span className="topbarIconBadge">2</span>
          <span className="topbarIconBadge">1</span>
        </div>
        <img src="/assets/person/1.jpeg" alt="profile" className="topbarImg" onClick={onLogout} />
      </div>
    </div>
  );
}

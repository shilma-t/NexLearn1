import React, { useState } from "react";
import "./topbar.css";

export default function Topbar({ onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <span className="logo">NexLearn</span>
        </div>

        <div className="topbarRight">
          <button className="logoutButton" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Are you sure you want to logout?</h3>
            <div className="modalActions">
              <button className="confirmBtn" onClick={confirmLogout}>Yes</button>
              <button className="cancelBtn" onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

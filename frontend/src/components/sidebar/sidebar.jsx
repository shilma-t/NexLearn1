import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { Person, AddPhotoAlternate } from "@mui/icons-material";

// Default profile image as a data URL
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const navIcons = {
  Home: (
    <svg viewBox="0 0 24 24"><path d="M3 12L12 4l9 8" stroke="currentColor"/><path d="M9 21V12h6v9" stroke="currentColor"/></svg>
  ),
  "Learning Plans": (
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor"/><path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor"/></svg>
  ),
  "Shared Plans": (
    <svg viewBox="0 0 24 24"><circle cx="7" cy="12" r="3" stroke="currentColor"/><circle cx="17" cy="6" r="3" stroke="currentColor"/><circle cx="17" cy="18" r="3" stroke="currentColor"/><path d="M9.5 10.5l5-3M9.5 13.5l5 3" stroke="currentColor"/></svg>
  ),
  Communities: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="4" stroke="currentColor"/><path d="M5.5 21v-2a4.5 4.5 0 019 0v2" stroke="currentColor"/></svg>
  ),
  "My Progress": (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/><path d="M7 17V9M12 17V5M17 17v-4" stroke="currentColor"/></svg>
  ),
  "All Progress": (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/><path d="M7 17V13M12 17V7M17 17v-2" stroke="currentColor"/></svg>
  ),
  "Create Progress": (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor"/><path d="M12 8v8M8 12h8" stroke="currentColor"/></svg>
  ),
  "Create Plan": (
    <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor"/><path d="M8 12h8M12 8v8" stroke="currentColor"/></svg>
  )
};

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user info from Google session
    const sessionData = localStorage.getItem('skillhub_user_session');
    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        setUser({
          username: userData.name,
          profilePic: userData.picture,
          email: userData.email
        });
      } catch (e) {
        console.error("Error parsing session:", e);
      }
    }
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const navigationItems = [
    { path: "/home", icon: navIcons["Home"], text: "Home" },
    { path: "/plans", icon: navIcons["Learning Plans"], text: "Learning Plans" },
    { path: "/shared-plans", icon: navIcons["Shared Plans"], text: "Shared Plans" },
    { path: "/community", icon: navIcons["Communities"], text: "Communities" },
    { path: "/my-progress", icon: navIcons["My Progress"], text: "My Progress" },
    { path: "/all-progress", icon: navIcons["All Progress"], text: "All Progress" },
    { path: "/create-progress", icon: navIcons["Create Progress"], text: "Create Progress" },
    { path: "/plan/new", icon: navIcons["Create Plan"], text: "Create Plan" }
  ];

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarProfile" onClick={handleProfileClick}>
          <img
            className="sidebarProfileImg"
            src={user?.profilePic || DEFAULT_PROFILE_IMAGE}
            alt="Profile"
          />
          <span className="sidebarProfileName">{user?.username || "User"}</span>
        </div>
        <ul className="sidebarList">
          {navigationItems.map((item) => (
            <li key={item.path} className="sidebarListItem">
              <Link 
                to={item.path} 
                className={`sidebarLink ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebarIcon">{item.icon}</span>
                <span className="sidebarText">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

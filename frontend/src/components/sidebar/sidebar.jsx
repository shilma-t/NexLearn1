import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { Person, AddPhotoAlternate } from "@mui/icons-material";

// Default profile image as a data URL
const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

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
    { path: "/home", icon: "🏠", text: "Home" },
    { path: "/plans", icon: "📚", text: "Learning Plans" },
    { path: "/shared-plans", icon: "🔗", text: "Shared Plans" },
    { path: "/my-progress", icon: "📊", text: "My Progress" },
    { path: "/all-progress", icon: "📈", text: "All Progress" },
    { path: "/create-progress", icon: "➕", text: "Create Progress" },
    { path: "/plan/new", icon: "✏️", text: "Create Plan" }
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

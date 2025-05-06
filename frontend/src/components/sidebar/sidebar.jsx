import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

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
          profilePicture: userData.picture,
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
    { name: "Feed", link: "/", icon: "🏠" },
    { name: "Profile", link: "/profile", icon: "👤" },
    { name: "Videos", link: "/videos", icon: "🎥" },
    { name: "Groups", link: "/groups", icon: "👥" },
    { name: "Bookmarks", link: "/bookmarks", icon: "🔖" },
    { name: "Questions", link: "/questions", icon: "❓" },
    { name: "Jobs", link: "/jobs", icon: "💼" },
    { name: "Events", link: "/events", icon: "📅" },
    { name: "Courses", link: "/courses", icon: "📚" },
  ];

  return (
    <div className="sidebar">
      {user && (
        <div className="sidebarProfile" onClick={handleProfileClick}>
          <img
            src={user.profilePicture || "/default-profile-pic.jpg"}
            alt="Profile"
            className="sidebarProfileImg"
          />
          <span className="sidebarProfileName">{user.username}</span>
        </div>
      )}

      <ul className="sidebarList">
        {navigationItems.map((item) => (
          <li
            key={item.name}
            className={`sidebarListItem ${location.pathname === item.link ? 'active' : ''}`}
            onClick={() => navigate(item.link)}
          >
            <span className="sidebarIcon">{item.icon}</span>
            <span className="sidebarText">{item.name}</span>
          </li>
        ))}
        <li 
          className="sidebarListItem createItem" 
          onClick={() => window.dispatchEvent(new CustomEvent("open-create-modal"))}
        >
          <span className="sidebarIcon">✏️</span>
          <span className="sidebarText">Create</span>
        </li>
      </ul>

      <button className="sidebarButton">
        <span className="sidebarIcon">📋</span>
        <span className="sidebarText">Show More</span>
      </button>
      <hr className="sidebarDivider" />
    </div>
  );
}

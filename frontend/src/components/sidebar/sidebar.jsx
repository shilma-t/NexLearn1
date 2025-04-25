import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9006/api/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

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
        {[
          "Feed",
          "Chats",
          "Videos",
          "Groups",
          "Bookmarks",
          "Questions",
          "Jobs",
          "Events",
          "Courses",
        ].map((item) => (
          <li key={item} className="sidebarListItem">
            {item}
          </li>
        ))}
      </ul>

      <button className="sidebarButton">Show More</button>
      <hr />
    </div>
  );
}

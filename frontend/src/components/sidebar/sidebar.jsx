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
          { name: "Feed", link: "/" },
          { name: "Profile", link: "/profile" },
          { name: "Videos", link: "/videos" },
          { name: "Groups", link: "/groups" },
          { name: "Bookmarks", link: "/bookmarks" },
          { name: "Questions", link: "/questions" },
          { name: "Jobs", link: "/jobs" },
          { name: "Events", link: "/events" },
          { name: "Courses", link: "/courses" },
        ].map((item) => (
          <li
            key={item.name}
            className="sidebarListItem"
            onClick={() => navigate(item.link)}
          >
            {item.name}
          </li>
          
        ))}
        <li className="sidebarListItem" onClick={() => window.dispatchEvent(new CustomEvent("open-create-modal"))}>
  Create
</li>

      </ul>

      <button className="sidebarButton">Show More</button>
      <hr />
    </div>
  
  );
}

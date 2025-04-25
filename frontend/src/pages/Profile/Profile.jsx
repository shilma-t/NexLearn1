import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:9006/api/profile", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile">
      <div className="profileCover">
        <img src={user.coverPicture} alt="Cover" className="profileCoverImg" />
        <img src={user.profilePicture} alt="Profile" className="profileUserImg" />
      </div>
      <div className="profileInfo">
        <h4 className="profileInfoName">{user.name}</h4>
        <span className="profileInfoBio">{user.bio}</span>
      </div>
      <hr />
      <h3>User's Posts (optional - add your post list here)</h3>
    </div>
  );
}

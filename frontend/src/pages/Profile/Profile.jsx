import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:9006/api/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="profilePage">
      <p>hello</p>
    </div>
  );
}

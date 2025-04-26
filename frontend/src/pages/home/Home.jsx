import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import "../../App.css"; // Import the global styles

export default function Home() {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <>
      <Topbar onLogout={handleLogout} />
      <div className="appContainer">
        <div className="homeContainer">
          <Sidebar />
          <Feed />
          <Rightbar />
        </div>
      </div>
    </>
  );
}

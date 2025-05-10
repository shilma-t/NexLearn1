import React from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import "../../App.css"; // Import the global style

const Home = () => {
  return (
    <div className="insta-home-row">
      <div className="insta-sidebar"><Sidebar /></div>
      <div className="insta-feed"><Feed /></div>
      <div className="insta-rightbar"><Rightbar /></div>
    </div>
  );
};

export default Home;


import React, { useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css";
import "../../App.css"; // Import the global style

const Home = () => {

  return (
    <>
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

export default Home;


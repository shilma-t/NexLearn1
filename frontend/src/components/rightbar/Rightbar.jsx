import React from "react";
import "./rightbar.css";

export default function Rightbar() {
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="userInfo">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rightbarProfileImg"
          />
          <p><b>John Carter</b></p>
          <p><b>City:</b> New York</p>
          <p><b>From:</b> Madrid</p>
          <p><b>Relationship:</b> Single</p>
        </div>
        <div className="rightbarAd">
          <h4 className="rightbarTitle">Sponsored</h4>
          <img
            src="/assets/rightbarAd.avif"
            alt="Ad"
            className="rightbarAdImg"
          />
        </div>
        <h4 className="rightbarTitle">Suggested for You</h4>
        <div className="rightbarFollowings">
          {[...Array(6)].map((_, i) => (
            <div className="rightbarFollowing" key={i}>
              <img
                src={`/assets/${i + 1}.jpeg`}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">John Carter</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

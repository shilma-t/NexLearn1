import React from "react";
import "./rightbar.css";

export default function Rightbar() {
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="userInfo">
          <p><b>City:</b> New York</p>
          <p><b>From:</b> Madrid</p>
          <p><b>Relationship:</b> Single</p>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {[...Array(6)].map((_, i) => (
            <div className="rightbarFollowing" key={i}>
              <img src={`/assets/person/${i + 1}.jpeg`} alt="" className="rightbarFollowingImg" />
              <span className="rightbarFollowingName">John Carter</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

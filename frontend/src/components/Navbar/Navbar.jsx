import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, clearSession, getSession } from "../../utils/SessionManager";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const session = getSession();  // Fetch session data from localStorage

  const handleLogout = () => {
    clearSession();  // Clear the session data
    navigate("/");    // Redirect to home page after logout
  };

  return (
    <nav>
      <h2>Skillhub</h2>
      <div className="nav-links">
        {isLoggedIn() ? (
          <>
            <span className="welcome-text">
              Welcome, {session?.name || session?.email}
            </span>
            <Link to="/home">Home</Link>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

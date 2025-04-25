import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Importing the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Manual login handler
  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9006/auth/login", {
        email,
        password,
      });

      const msg = response.data.message;
      if (msg === "Login successful") {
        localStorage.setItem("isLoggedIn", "true"); // ✅ Set this!
        navigate("/home");
      } else {
        setError(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  // Google login handler - redirects to backend
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9006/oauth2/authorization/google";
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <form onSubmit={handleManualLogin} className="login-form">
        <div className="input-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="input-field"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="input-field"
          />
        </div>
        <div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}

      <hr className="separator" />

      <div>
        <button onClick={handleGoogleLogin} className="google-login-button">
          Login with Google
        </button>
      </div>

      <div>
        <p className="signup-link">
          Don't have an account?{" "}
          <Link to="/register" className="clickable-text">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

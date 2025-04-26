import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9006/auth/login", {
        email,
        password,
      });

      const msg = response.data.message;
      if (msg === "Login successful") {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/home");
      } else {
        setError(msg);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9006/oauth2/authorization/google";
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="login-page">
      
      <div className="video-background">
        <video autoPlay loop muted>
          <source src="/assets/video1.mp4" type="video/mp4" />
        </video>
        <video autoPlay loop muted>
          <source src="/assets/video2.mp4" type="video/mp4" />
        </video>
        <video autoPlay loop muted>
          <source src="/assets/video3.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="left-section">
        <h1 className="nexlearn-text">NexLearn</h1>
      </div>

      <div className="right-section">
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

          <button onClick={handleGoogleLogin} className="google-login-button">
            Login with Google
          </button>

          <p className="signup-link">
            Don't have an account?{" "}
            <span className="clickable-text" onClick={toggleRegister}>
              Sign Up
            </span>
          </p>
        </div>
      </div>

      {/* Register Popup */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="login-title">Register</h2>
            <RegisterForm onClose={toggleRegister} />
          </div>
        </div>
      )}
    </div>
  );
};

// Register Form as internal component
const RegisterForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9006/auth/register", {
        name,
        email,
        password,
      });

      if (response.data === "User registered successfully!") {
        onClose();
        navigate("/login");
      } else {
        setError(response.data);
      }
    } catch (err) {
      setError("An error occurred during registration.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="login-form">
      <div className="input-group">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="input-field"
        />
      </div>
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
      <button type="submit" className="submit-button">
        Register
      </button>
      {error && <p className="error-message">{error}</p>}
      <p className="signup-link">
        Already have an account?{" "}
        <span className="clickable-text" onClick={onClose}>
          Back to Login
        </span>
      </p>
    </form>
  );
};

export default Login;

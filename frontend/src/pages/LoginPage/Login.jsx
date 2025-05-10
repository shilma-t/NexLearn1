// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../utils/SessionManager";
import Register from "./Register";
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
      const response = await axios.post("http://localhost:9006/auth/login", { email, password });

      if (response.data.message === "Login successful!" && response.data.user) {
        saveSession(response.data.user);
        navigate("/home");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:9006/oauth2/authorization/google";
  };

  return (
    <div className="nexlearn-login-wrapper">
      <div className="nexlearn-login-left">
        <div className="nexlearn-logo">NexLearn</div>
      </div>
      <div className="nexlearn-login-right">
        <div className="nexlearn-login-content">
          <h1>Happening now</h1>
          <h2>Join today.</h2>
          <button className="nexlearn-social-btn" onClick={handleGoogleLogin} type="button">
            {/* You can add a Google SVG icon here if desired */}
            Sign up with Google
          </button>
          <div className="nexlearn-or">OR</div>
          <form className="nexlearn-login-form" onSubmit={handleManualLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button className="nexlearn-main-btn" type="submit">Sign in</button>
          </form>
          {error && <p className="error-message" style={{ color: '#ff4d4f', marginTop: '1rem' }}>{error}</p>}
          <div className="nexlearn-login-footer">
            Don't have an account?
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-color)",
                fontWeight: 600,
                marginLeft: "0.5em",
                cursor: "pointer",
                padding: 0,
                fontSize: "1em"
              }}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <Register show={showRegister} onClose={() => setShowRegister(false)} />
    </div>
  );
};

export default Login;

// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../utils/SessionManager";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleManualLogin} className="login-form">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" className="submit-button">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <hr className="separator" />
      <button onClick={handleGoogleLogin} className="google-login-button">Login with Google</button>
    </div>
  );
};

export default Login;

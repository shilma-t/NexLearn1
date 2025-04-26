import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // Optional if you separate styles

const Register = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9006/auth/register", {
        name,
        email,
        password,
      });
      if (response.data === "User registered successfully!") {
        navigate("/login");
      } else {
        setError(response.data);
      }
    } catch (error) {
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="register-popup">
        <h2 className="login-title">Register</h2>
        <form className="login-form" onSubmit={handleRegister}>
          <div className="input-group">
            <input
              className="input-field"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </div>
          <div className="input-group">
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group">
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button className="submit-button" type="submit">Register</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <button onClick={onClose} className="close-button">X</button>
      </div>
    </div>
  );
};

export default Register;

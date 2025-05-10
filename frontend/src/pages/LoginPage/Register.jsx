import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../utils/SessionManager";
import "./Register.css";

const Register = ({ show, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9006/auth/register", form);
      if (response.data === "User registered successfully!") {
        saveSession({ name: form.name, email: form.email });
        setSuccess(true);
        setTimeout(() => {
          onClose();
          navigate("/home");
        }, 1500);
      } else {
        setError(response.data);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed");
    }
  };

  if (!show) return null;

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("nexlearn-modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="nexlearn-modal-overlay" onClick={handleOverlayClick}>
      <div className="nexlearn-modal">
        <button className="nexlearn-modal-close" onClick={onClose}>&times;</button>
        {success ? (
          <div className="nexlearn-success-popup">
            <div className="nexlearn-success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#4B0082"/>
                <path d="M20 34L29 43L44 25" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="nexlearn-success-text">Successfully registered!</div>
          </div>
        ) : (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Create your account</h2>
            <form className="nexlearn-login-form" onSubmit={handleRegister}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" required />
              <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" required />
              <button className="nexlearn-main-btn" type="submit">Register</button>
            </form>
            {error && <p style={{ color: "#ff4d4f", marginTop: "1rem", textAlign: 'center' }}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default Register;

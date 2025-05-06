import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../utils/SessionManager";
import "./Register.css"; 

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
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
        navigate("/home");
      } else {
        setError(response.data);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" required />
        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;

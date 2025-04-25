import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import Login from "./pages/LoginPage/Login";
import Register from "./pages/LoginPage/Register";
import Home from "./pages/home/Home";
import Profile from "./pages/Profile/Profile"; 




const App = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <GoogleOAuthProvider clientId="235074436580-fekrpapo667arbo0jkqa9nmprcpqul96.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;

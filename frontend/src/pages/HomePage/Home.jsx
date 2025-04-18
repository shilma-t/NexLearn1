// /src/pages/Home.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Logout logic here, such as removing JWT token from localStorage
        navigate("/login");
    };

    return (
        <div>
            <h1>Welcome to NextLearn</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;

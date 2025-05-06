// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";
import { GoogleOAuthProvider } from "@react-oauth/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import OAuth2Redirect from "./utils/OAuth2Redirect";

// Pages
import Login from "./pages/LoginPage/Login";
import Register from "./pages/LoginPage/Register";
import Users from "./pages/LoginPage/Users";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/home/Home";
import LearningPlanForm from './pages/learningplan/LearningPlanForm';
import LearningPlanDetail from './pages/learningplan/LearningPlanDetail';
import LearningPlanList from './pages/learningplan/LearningPlanList';
import EditLearningPlanForm from './pages/learningplan/EditLearningPlanForm';

import CreateProgress from './pages/Progress/ProgressCreation';
import AllProgress from './pages/Progress/AllProgress'; 
import UserProgress from './pages/Progress/UserProgress';
import ProgressEdit from './pages/Progress/ProgressEdit';
import CommentSection from './components/CommentSection';



// --- PostPage with Comment Section ---
function PostPage() {
  return (
    <Container className="mt-5">
      <h1 className="title">Post Title</h1>
      <p className="subtitle">This is an example post. You can leave comments below 👇</p>
      <CommentSection postId="1" />
    </Container>
  );
}

// --- Main App Component ---
const App = () => {
  

  return (
    <GoogleOAuthProvider clientId="972748929791-jeth90tm8i9lvaa732aescu6veiuqbcd.apps.googleusercontent.com">
      <Router>
        
        <Navbar />
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/oauth2-redirect" element={<OAuth2Redirect />} />

            {/* Learning Plan Routes */}
            <Route path="/plan/new" element={<LearningPlanForm />} />
            <Route path="/plans" element={<LearningPlanList />} />
            <Route path="/plan/edit/:id" element={<EditLearningPlanForm />} />
            <Route path="/plan/:id" element={<LearningPlanDetail />} />

            {/* Progress Tracking Routes */}
            <Route path="/create-progress" element={<CreateProgress />} />
            <Route path="/all-progress" element={<AllProgress />} />
            <Route path="/my-progress" element={<UserProgress />} />
            <Route path="/edit-progress/:id" element={<ProgressEdit />} />

            {/* Post page with comments */}
            <Route path="/post" element={<PostPage />} />
          </Routes>
        
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;

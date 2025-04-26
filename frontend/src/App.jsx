// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Row, Col } from 'react-bootstrap';
import LearningPlanForm from './pages/learningplan/LearningPlanForm';
import LearningPlanDetail from './pages/learningplan/LearningPlanDetail';
import LearningPlanList from './pages/learningplan/LearningPlanList';
import EditLearningPlanForm from './pages/learningplan/EditLearningPlanForm';
import CreateProgress from './pages/Progress/ProgressCreation';
import AllProgress from './pages/Progress/AllProgress'; 
import UserProgress from './pages/Progress/UserProgress';
import ProgressEdit from './pages/Progress/ProgressEdit';
import CommentSection from './components/CommentSection'; // 🛑 Also import your Comment Section here
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// --- Dashboard Component (Initial View) ---
function Dashboard() {
  const navigate = useNavigate();
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '70vh', paddingTop: '5rem', paddingBottom: '5rem' }}>
      <h1 className="display-4 mb-3">Welcome to Your Learning Planner</h1>
      <p className="lead text-muted mb-5">
        Organize, track, and achieve your learning goals effectively.
      </p>
      <Row className="g-3 justify-content-center">
        <Col xs="auto">
          <Button variant="primary" size="lg" onClick={() => navigate('/plans')} style={{ minWidth: '200px', padding: '1rem 1.5rem' }}>
            View My Plans
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="success" size="lg" onClick={() => navigate('/plan/new')} style={{ minWidth: '200px', padding: '1rem 1.5rem' }}>
            Create New Plan
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

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
function App() {
  return (
    <Router>
      <Container fluid="md" className="mt-4 mb-5 flex-grow-1">
        <Routes>
          {/* Learning Plan routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan/new" element={<LearningPlanForm />} />
          <Route path="/plans" element={<LearningPlanList />} />
          <Route path="/plan/edit/:id" element={<EditLearningPlanForm />} />
          <Route path="/plan/:id" element={<LearningPlanDetail />} />

          {/* Progress Tracking routes */}
          <Route path="/create-progress" element={<CreateProgress />} />
          <Route path="/all-progress" element={<AllProgress />} />
          <Route path="/my-progress" element={<UserProgress />} />
          <Route path="/edit-progress/:id" element={<ProgressEdit />} />

          {/* Post page with comments */}
          <Route path="/post" element={<PostPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateProgress from './pages/Progress/ProgressCreation';
import AllProgress from './pages/Progress/AllProgress'; 
import UserProgress from './pages/Progress/UserProgress';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/create-progress" element={<CreateProgress />} />
        <Route path="/all-progress" element={<AllProgress />} /> 
        <Route path="/user-progress" element={<UserProgress/>} /> 
      </Routes>
    </Router>
  );
};

export default App;

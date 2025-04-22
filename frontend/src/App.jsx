// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateProgress from './pages/Progress/ProgressCreation';
import AllProgress from './pages/Progress/AllProgress'; 
import UserProgress from './pages/Progress/UserProgress';
import ProgressEdit from './pages/Progress/ProgressEdit';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/create-progress" element={<CreateProgress />} />
        <Route path="/all-progress" element={<AllProgress />} /> 
        <Route path="/my-progress" element={<UserProgress />} />
        <Route path="/edit-progress/:id" element={<ProgressEdit />} />
      
        
      </Routes>
    </Router>
  );
};

export default App;

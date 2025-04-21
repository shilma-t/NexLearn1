// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateProgress from './pages/Progress/ProgressCreation';
import AllProgress from './pages/Progress/AllProgress'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/create-progress" element={<CreateProgress />} />
        <Route path="/all-progress" element={<AllProgress />} /> 
      
      </Routes>
    </Router>
  );
};

export default App;

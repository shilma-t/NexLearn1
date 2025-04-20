// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateProgress from './pages/Progress/ProgressCreation';
import AllProgress from './pages/Progress/AllProgress'; // Import the AllProgress component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/create-progress" element={<CreateProgress />} />
        <Route path="/all-progress" element={<AllProgress />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
};

export default App;

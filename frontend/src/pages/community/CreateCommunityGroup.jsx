import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

const CreateCommunityGroup = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionData = localStorage.getItem('skillhub_user_session');
    const userEmail = sessionData ? JSON.parse(sessionData).email : null;
    if (!userEmail) {
      setError('User not logged in');
      return;
    }
    try {
      await axiosInstance.post('/groups', {
        name,
        description,
        ownerId: userEmail
      });
      navigate('/community');
    } catch (err) {
      setError('Failed to create community');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Community</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
};

export default CreateCommunityGroup; 
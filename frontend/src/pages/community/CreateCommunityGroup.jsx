import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import Sidebar from '../../components/sidebar/sidebar';

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      <Sidebar />
      <main style={{
        marginLeft: '260px',
        width: '100%',
        padding: '80px 32px 40px',
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
      }}>
        <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: 32 }}>Create Community</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#fff' }}>Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#fff' }}>Description</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}
            />
          </div>
          {error && <div className="text-danger mb-2">{error}</div>}
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ background: '#4b0076', border: 'none' }}
          >
            Create
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateCommunityGroup; 
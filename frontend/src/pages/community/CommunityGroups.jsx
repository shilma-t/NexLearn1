import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import Sidebar from '../../components/sidebar/sidebar';

const CommunityGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const sessionData = localStorage.getItem('skillhub_user_session');
    const userEmail = sessionData ? JSON.parse(sessionData).email : null;
    if (!userEmail) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    axiosInstance.get(`/groups/user/${userEmail}`)
      .then(res => setGroups(res.data))
      .catch(() => setError('Failed to load groups'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: '#fff', fontWeight: 700 }}>My Communities</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/community/create')}
            style={{ background: '#4b0076', border: 'none' }}
          >
            Create Community
          </button>
        </div>
        {groups.length === 0 ? (
          <div style={{ color: '#ccc', textAlign: 'center', marginTop: 32 }}>No communities found.</div>
        ) : (
          <ul className="list-group">
            {groups.map(group => (
              <li key={group.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ background: '#181818', border: '1px solid #333', color: '#fff', marginBottom: 8, borderRadius: 8 }}>
                <Link to={`/community/${group.id}`} style={{ color: '#fff', textDecoration: 'none' }}>{group.name}</Link>
                <span className="text-muted small" style={{ color: '#aaa' }}>{group.description}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default CommunityGroups; 
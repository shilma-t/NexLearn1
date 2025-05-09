import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Communities</h2>
        <button className="btn btn-primary" onClick={() => navigate('/community/create')}>Create Community</button>
      </div>
      {groups.length === 0 ? (
        <div>No communities found.</div>
      ) : (
        <ul className="list-group">
          {groups.map(group => (
            <li key={group.id} className="list-group-item d-flex justify-content-between align-items-center">
              <Link to={`/community/${group.id}`}>{group.name}</Link>
              <span className="text-muted small">{group.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunityGroups; 
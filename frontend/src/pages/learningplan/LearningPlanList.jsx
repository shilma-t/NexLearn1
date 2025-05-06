import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import './LearningPlanList.css';

const LearningPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sessionData = localStorage.getItem('skillhub_user_session');
      if (!sessionData) {
        throw new Error('Please login to view learning plans');
      }

      const userData = JSON.parse(sessionData);
      const userId = userData.email;

      const [userPlansResponse, sharedPlansResponse] = await Promise.all([
        axiosInstance.get(`/plans/user/${userId}`),
        axiosInstance.get(`/plans/shared/${userId}`)
      ]);

      const allPlans = [
        ...userPlansResponse.data,
        ...sharedPlansResponse.data
      ];

      setPlans(allPlans);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError(err.response?.data?.message || 'Failed to fetch learning plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading learning plans...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchPlans} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="learning-plan-list">
      <div className="header">
        <h1>Learning Plans</h1>
        <Link to="/plan/new" className="create-button">
          Create New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="no-plans">
          <p>No learning plans found.</p>
          <Link to="/plan/new" className="create-first-plan">
            Create your first learning plan
          </Link>
        </div>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <Link to={`/plan/${plan.id}`} key={plan.id} className="plan-card">
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <div className="plan-meta">
                <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
                <span>Status: {plan.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPlanList;
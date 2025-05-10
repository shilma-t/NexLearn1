import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import './LearningPlanList.css';
import Sidebar from '../../components/sidebar/sidebar';

const LearningPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getUserInfo = () => {
    const sessionData = localStorage.getItem('skillhub_user_session');
    if (sessionData) {
      try {
        const userData = JSON.parse(sessionData);
        return {
          userId: userData.email,
          username: userData.name
        };
      } catch (e) {
        console.error("Error parsing session:", e);
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const sessionData = localStorage.getItem('skillhub_user_session');
        if (!sessionData) {
          setError('Please login to view your learning plans');
          setLoading(false);
          return;
        }
        const userData = JSON.parse(sessionData);
        const response = await axiosInstance.get(`/plans/user/${userData.email}`);
        if (response && response.data) {
          const formattedPlans = response.data.map(plan => ({
            ...plan,
            id: plan.id || plan._id
          }));
          setPlans(formattedPlans);
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load learning plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

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
          <h2 style={{ color: '#fff', fontWeight: 700 }}>My Learning Plans</h2>
          <Link to="/plan/new">
            <Button variant="primary" style={{ background: '#4b0076', border: 'none' }}>Create New Plan</Button>
          </Link>
        </div>
        
        {plans.length === 0 ? (
          <div className="text-center mt-5">
            <p style={{ color: '#ccc' }}>No learning plans found. Create your first plan!</p>
          </div>
        ) : (
          <Row>
            {plans.map((plan, idx) => {
              const planId = plan.id || plan._id;
              if (!planId) {
                console.error('Plan missing ID:', plan);
                return null;
              }
              
              return (
                <Col key={planId} md={4} className="mb-4">
                  <Card style={{ background: '#181818', color: '#fff', border: '1px solid #333', borderRadius: 16 }}>
                    <Card.Body>
                      <Card.Title style={{ color: '#fff' }}>{plan.title}</Card.Title>
                      <Card.Text style={{ color: '#ccc' }}>{plan.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <Link to={`/plan/${planId}`}>
                          <Button variant="primary" size="sm" style={{ background: '#4b0076', border: 'none' }}>View Details</Button>
                        </Link>
                      </div>
                    </Card.Body>
                    <Card.Footer style={{ background: '#181818', color: '#aaa', borderTop: '1px solid #333' }}>
                      Created: {new Date(plan.createdAt).toLocaleDateString()}
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </main>
    </div>
  );
};

export default LearningPlanList;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../../utils/axios';
import Sidebar from '../../components/sidebar/sidebar';

const SharedPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedPlans = async () => {
      try {
        const response = await axiosInstance.get('/plans/shared/all');
        if (response && response.data) {
          setPlans(response.data);
        }
      } catch (err) {
        console.error('Error fetching shared plans:', err);
        setError('Failed to load shared plans');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedPlans();
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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Button 
            variant="link" 
            onClick={() => navigate(-1)}
            style={{ 
              color: '#fff', 
              textDecoration: 'none',
              padding: 0,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowLeft /> Back
          </Button>

          <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: 32 }}>Shared Learning Plans</h2>
          {plans.length === 0 ? (
            <div className="text-center mt-5">
              <p style={{ color: '#ccc' }}>No shared learning plans found.</p>
            </div>
          ) : (
            <Row>
              {plans.map((plan) => {
                const planId = plan.id || plan._id;
                if (!planId) {
                  console.error('Plan missing ID:', plan);
                  return null;
                }

                return (
                  <Col key={planId} md={4} className="mb-4">
                    <Card style={{ background: '#181818', color: '#fff', border: '1px solid #333', borderRadius: 16 }}>
                      <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src={plan.ownerProfilePic || 'https://via.placeholder.com/40'}
                            alt={plan.ownerName}
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px' }}
                          />
                          <div>
                            <div className="text-muted small" style={{ color: '#aaa' }}>Shared by</div>
                            <div style={{ color: '#fff' }}>{plan.ownerName}</div>
                          </div>
                        </div>
                        <Card.Title style={{ color: '#fff' }}>{plan.title}</Card.Title>
                        <Card.Text style={{ color: '#ccc' }}>{plan.description}</Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Link to={`/plan/${planId}`}>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              style={{ 
                                background: '#4b0076', 
                                border: 'none',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                  background: '#6b0086',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(75, 0, 118, 0.2)'
                                }
                              }}
                              className="view-details-btn"
                            >
                              View Details
                            </Button>
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
        </div>
      </main>
    </div>
  );
};

export default SharedPlans; 
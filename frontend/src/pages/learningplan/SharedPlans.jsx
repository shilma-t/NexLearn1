import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';


const SharedPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    <Container className="mt-4">
      <h2>Shared Learning Plans</h2>
      {plans.length === 0 ? (
        <div className="text-center mt-5">
          <p>No shared learning plans found.</p>
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
                <Card>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={plan.ownerProfilePic || 'https://via.placeholder.com/40'}
                        alt={plan.ownerName}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px' }}
                      />
                      <div>
                        <div className="text-muted small">Shared by</div>
                        <div>{plan.ownerName}</div>
                      </div>
                    </div>
                    <Card.Title>{plan.title}</Card.Title>
                    <Card.Text>{plan.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Link to={`/plan/${planId}`}>
                        <Button variant="primary" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </Card.Body>
                  <Card.Footer className="text-muted">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default SharedPlans; 
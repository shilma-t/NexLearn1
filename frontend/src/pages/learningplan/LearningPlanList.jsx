import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import './LearningPlanList.css';

const LearningPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get('/plans');
        if (response && response.data) {
          const formattedPlans = response.data.map(plan => ({
            ...plan,
            id: plan._id
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
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Learning Plans</h2>
        <Link to="/plan/create">
          <Button variant="primary">Create New Plan</Button>
        </Link>
      </div>
      
      {plans.length === 0 ? (
        <div className="text-center mt-5">
          <p>No learning plans found. Create your first plan!</p>
        </div>
      ) : (
          <Row>
          {plans.map((plan) => (
            <Col key={plan._id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{plan.title}</Card.Title>
                  <Card.Text>{plan.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/plan/${plan._id}`}>
                      <Button variant="primary" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/plan/edit/${plan._id}`}>
                      <Button variant="outline-primary" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </Card.Footer>
              </Card>
              </Col>
          ))}
          </Row>
      )}
    </Container>
  );
};

export default LearningPlanList;
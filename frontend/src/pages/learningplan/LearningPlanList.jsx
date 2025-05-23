import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:9006/api';

const LearningPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [sharedPlans, setSharedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get user ID from storage or use default values
  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'user123';
  };
  const SHARED_USER_ID = "sharedUser123";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const [plansResponse, sharedPlansResponse] = await Promise.all([
          axios.get(`${API_URL}/plans/user/${getUserId()}`, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }),
          axios.get(`${API_URL}/plans/shared/${SHARED_USER_ID}`, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          })
        ]);
        setPlans(plansResponse.data);
        setSharedPlans(sharedPlansResponse.data);
      } catch (error) {
        setError('Failed to load learning plans');
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPlans();
  }, []);
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`${API_URL}/plans/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (error) {
        setError('Failed to delete learning plan');
        console.error('Error deleting plan:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const renderPlanCard = (plan, isShared = false) => (
    <Col md={4} className="mb-4" key={plan.id}>
      <Card className="h-100">
        <Card.Body>
          <Card.Title>{plan.title}</Card.Title>
          <Card.Text>{plan.description}</Card.Text>
          <div className="mb-2">
            <small className="text-muted">
              {plan.topics.length} topics | 
              {plan.topics.filter(t => t.completed).length} completed
            </small>
          </div>
          {isShared && (
            <Badge bg="info" className="mb-2">Shared Plan</Badge>
          )}
          <div className="d-flex justify-content-between mt-3">
            <Link to={`/plan/${plan.id}`}>
              <Button variant="primary">View Details</Button>
            </Link>
            {!isShared && (
              <Button 
                variant="danger" 
                onClick={() => handleDelete(plan.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Learning Plans</h2>
        <Link to="/plan/new">
          <Button variant="success">Create New Plan</Button>
        </Link>
      </div>
      
      <Tabs defaultActiveKey="myPlans" className="mb-3">
        <Tab eventKey="myPlans" title="My Plans">
          <Row>
            {plans.length > 0 ? (
              plans.map(plan => renderPlanCard(plan))
            ) : (
              <Col>
                <Alert variant="info">
                  You don't have any learning plans yet. Create one to get started!
                </Alert>
              </Col>
            )}
          </Row>
        </Tab>
        
        <Tab eventKey="sharedPlans" title="View Shared Plans">
          <Row>
            {sharedPlans.length > 0 ? (
              sharedPlans.map(plan => renderPlanCard(plan, true))
            ) : (
              <Col>
                <Alert variant="info">
                  No shared plans available yet.
                </Alert>
              </Col>
            )}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LearningPlanList;
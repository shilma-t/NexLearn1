import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Badge, Alert, Tabs, Tab, ListGroup } from 'react-bootstrap';
import axios from 'axios';


const API_URL = 'http://localhost:9006/api';

const LearningPlanList = () => {
  const [plans, setPlans] = useState([]);
  const [sharedPlans, setSharedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const [plansResponse, sharedPlansResponse] = await Promise.all([
          axios.get(`${API_URL}/plans/user/user123`),
          axios.get(`${API_URL}/plans/shared/sharedUser123`)
        ]);
        setPlans(plansResponse.data);
        setSharedPlans(sharedPlansResponse.data);
      } catch (error) {
        setError('Failed to load learning plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const renderPlanCard = (plan) => (
    <Col md={4} className="mb-4" key={plan.id}>
      <Card className="plan-card h-100">
        <Card.Body>
          <Card.Title>{plan.title}</Card.Title>
          <Card.Text>{plan.description}</Card.Text>
          <div className="mt-3">
            <Link to={`/plan/${plan.id}`}>
              <Button variant="primary">View Details</Button>
            </Link>
            
            <Button variant="danger" className="ms-2">Delete</Button>
       
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  const renderViewShared = (plan) => (
    <Col md={4} className="mb-4" key={plan.id}>
      <Card className="plan-card h-100">
        <Card.Body>
          <Card.Title>{plan.title}</Card.Title>
          <Card.Text>{plan.description}</Card.Text>
          <h3>Topics</h3>
                {Array.isArray(plan.topics) && plan.topics.length > 0 ? (
                  plan.topics.map((topic) => (
                    <Card key={topic.id || `topic-${Math.random()}`} className="mb-3">
                      <Card.Body>
                        <Card.Title>{topic.name || 'Untitled Topic'}</Card.Title>
                        <Card.Text>{topic.description || 'No description available'}</Card.Text>
                        <div className="mb-2">
                          <small>
                            Start: {topic.startDate || 'Not set'} | End: {topic.endDate || 'Not set'}
                          </small>
                        </div>
                        <Badge bg={topic.completed ? 'success' : 'warning'}>
                          {topic.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                        
                        <h5 className="mt-3">Resources</h5>
                        {Array.isArray(topic.resources) && topic.resources.length > 0 ? (
                          <ListGroup>
                            {topic.resources.map((resource) => (
                              <ListGroup.Item key={resource.id || `resource-${Math.random()}`}>
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {resource.name || 'Unnamed Resource'}
                                </a>
                                <Badge bg="secondary" className="ms-2">
                                  {resource.type || 'Unknown'}
                                </Badge>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <p>No resources added yet</p>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <Alert variant="info">No topics added to this plan yet</Alert>
                )}
          <div className="mt-3">
            <Link to={`/plan/${plan.id}`}>
              {/* <Button variant="primary">View Details</Button> */}
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="mt-4">
      <Tabs defaultActiveKey="myPlans">
        <Tab eventKey="myPlans" title="My Plans">
          <Row>{plans.map(renderPlanCard)}</Row>
        </Tab>
        <Tab eventKey="sharedPlans" title="View Shared Plans">
          <Row>{sharedPlans.map(renderViewShared)}</Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LearningPlanList;

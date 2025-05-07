import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import axiosInstance from '../../utils/axios';
import SharePlanModal from './SharePlanModal';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) {
        setError('Invalid plan ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/plans/${id}`);
        if (response && response.data) {
          setPlan(response.data);
        } else {
          setError('No data received from server');
        }
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(`Failed to load learning plan: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleEdit = () => {
    navigate(`/plan/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axiosInstance.delete(`/plans/${id}`);
        navigate('/plans');
      } catch (err) {
        setError(`Failed to delete learning plan: ${err.message || 'Unknown error'}`);
        console.error('Error deleting plan:', err);
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareSubmit = async (userId) => {
    try {
      await axiosInstance.post(`/plans/${id}/share/${userId}`);
      setShowShareModal(false);
      // Refresh the plan data
      const response = await axiosInstance.get(`/plans/${id}`);
      if (response && response.data) {
        setPlan(response.data);
      }
    } catch (err) {
      setError(`Failed to share learning plan: ${err.message || 'Unknown error'}`);
      console.error('Error sharing plan:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/plans')}>
              Return to Plans
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Learning plan not found
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/plans')}>
              Return to Plans
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>{plan.title}</h2>
          <div>
            <Button variant="primary" onClick={handleEdit} className="me-2">
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete} className="me-2">
              Delete
            </Button>
            <Button variant="success" onClick={handleShare}>
              Share
            </Button>
      </div>
        </Card.Header>
            <Card.Body>
          <Card.Text>{plan.description}</Card.Text>
          <h4>Topics</h4>
          <ListGroup>
            {plan.learningTopics?.map((topic, index) => (
              <ListGroup.Item key={index}>
                <h5>{topic.title}</h5>
                <p>{topic.description}</p>
                {topic.resources && (
                  <div>
                    <strong>Resources:</strong>
                    <p>{topic.resources}</p>
              </div>
                )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
            </Card.Body>
        <Card.Footer>
          <Badge bg="info">Status: {plan.status}</Badge>
        </Card.Footer>
          </Card>

      <SharePlanModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        onShare={handleShareSubmit}
      />
    </Container>
  );
};

export default LearningPlanDetail;
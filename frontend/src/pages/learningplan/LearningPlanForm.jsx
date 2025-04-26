import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicForm from './TopicForm';

const API_URL = 'http://localhost:9006/api';

const LearningPlanForm = ({ onCancel }) => {
  const navigate = useNavigate();

  // Get user ID from storage or use a default one for testing
  const getUserId = () => {
    return localStorage.getItem('userId') || sessionStorage.getItem('userId') || 'user123';
  };

  const [plan, setPlan] = useState({
    title: '',
    description: '',
    topics: [],
    userId: getUserId(),
    sharedWith: []
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Set up axios with appropriate CORS headers
      const response = await axios.post(`${API_URL}/plans`, plan, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      navigate('/');
    } catch (err) {
      setError('Failed to save learning plan');
      console.error(err);
    }
  };

  const handleAddTopic = () => {
    setPlan(prev => ({
      ...prev,
      topics: [...prev.topics, {
        id: Date.now().toString(),
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        completed: false,
        resources: []
      }]
    }));
  };

  const handleTopicChange = (updatedTopic, index) => {
    setPlan(prev => {
      const newTopics = [...prev.topics];
      newTopics[index] = updatedTopic;
      return { ...prev, topics: newTopics };
    });
  };

  const handleRemoveTopic = (index) => {
    setPlan(prev => {
      const newTopics = [...prev.topics];
      newTopics.splice(index, 1);
      return { ...prev, topics: newTopics };
    });
  };

  // Use the onCancel prop if provided, otherwise fallback to default navigation
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create New Learning Plan</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={plan.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={plan.description}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>
        
        <h3 className="mt-4">Topics</h3>
        {plan.topics.map((topic, index) => (
          <Card key={topic.id} className="mb-3">
            <Card.Body>
              <TopicForm
                topic={topic}
                onChange={(updatedTopic) => handleTopicChange(updatedTopic, index)}
                onRemove={() => handleRemoveTopic(index)}
              />
            </Card.Body>
          </Card>
        ))}
        <Button variant="secondary" onClick={handleAddTopic} className="mb-3">
          Add Topic
        </Button>
        
        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit">
            Create Plan
          </Button>
          <Button variant="outline-secondary" type="button" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LearningPlanForm;
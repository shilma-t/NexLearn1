// src/components/EditLearningPlanForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../utils/axios';

const EditLearningPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState({
    title: '',
    description: '',
    learningTopics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axiosInstance.put(`/plans/${id}`, plan);
      navigate(`/plan/${id}`);
    } catch (err) {
      console.error('Error updating plan:', err);
      setError(`Failed to update learning plan: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...plan.learningTopics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value
    };
    setPlan(prev => ({
      ...prev,
      learningTopics: updatedTopics
    }));
  };

  const addTopic = () => {
    setPlan(prev => ({
      ...prev,
      learningTopics: [
        ...prev.learningTopics,
        { title: '', description: '', resources: '' }
      ]
    }));
  };

  const removeTopic = (index) => {
    setPlan(prev => ({
      ...prev,
      learningTopics: prev.learningTopics.filter((_, i) => i !== index)
    }));
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

  return (
    <Container className="mt-4">
      <h2>Edit Learning Plan</h2>
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

        <h4>Topics</h4>
        {plan.learningTopics.map((topic, index) => (
          <div key={index} className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Topic {index + 1}</h5>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeTopic(index)}
              >
                Remove
              </Button>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={topic.title}
                onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={topic.description}
                onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                rows={2}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resources</Form.Label>
              <Form.Control
                as="textarea"
                value={topic.resources}
                onChange={(e) => handleTopicChange(index, 'resources', e.target.value)}
                rows={2}
                placeholder="Enter resources (one per line)"
              />
            </Form.Group>
          </div>
        ))}

        <Button
          type="button"
          variant="outline-primary"
          onClick={addTopic}
          className="mb-4"
        >
          Add Topic
        </Button>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/plan/${id}`)}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditLearningPlanForm;
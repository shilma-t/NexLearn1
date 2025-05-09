// src/components/EditLearningPlanForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../utils/axios';

const EditLearningPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || id === '0') {
      setError('Invalid plan ID.');
      setLoading(false);
      return;
    }
    const fetchPlan = async () => {
      try {
        const response = await axiosInstance.get(`/plans/${id}`);
        if (response && response.data) {
          const planData = {
            ...response.data,
            topics: response.data.topics || []
          };
          setPlan(planData);
        } else {
          setError('No data received from server');
        }
      } catch (err) {
        setError('Failed to fetch plan.');
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
      // Transform the data to match backend expectations
      const planData = {
        ...plan,
        topics: plan.topics.map(topic => ({
          name: topic.title,
          description: topic.description,
          resources: [{
            name: topic.resources,
            url: '',
            type: 'TEXT'
          }]
        }))
      };

      await axiosInstance.put(`/plans/${id}`, planData);
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
    const updatedTopics = [...plan.topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value
    };
    setPlan(prev => ({
      ...prev,
      topics: updatedTopics
    }));
  };

  const addTopic = () => {
    setPlan(prev => ({
      ...prev,
      topics: [
        ...prev.topics,
        { title: '', description: '', resources: '' }
      ]
    }));
  };

  const removeTopic = (index) => {
    setPlan(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!plan) return <div>No plan found.</div>;

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
        {plan.topics.map((topic, index) => (
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
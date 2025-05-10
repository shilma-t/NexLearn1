// src/components/EditLearningPlanForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../utils/axios';
import './LearningPlanForm.css';

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
            topics: response.data.topics.map(topic => ({
              title: topic.name,
              description: topic.description,
              resources: topic.resources && topic.resources.length > 0 ? topic.resources[0].name : ''
            }))
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Transform the data to match backend expectations
      const planData = {
        ...plan,
        topics: plan.topics.map(topic => ({
          name: topic.title.trim(),
          description: topic.description.trim(),
          resources: [{
            name: topic.resources ? topic.resources.trim() : '',
            url: '',
            type: 'OTHER'
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!plan) return <div>No plan found.</div>;

  return (
    <div className="learning-plan-form">
      <div className="form-container">
        <h1>Edit Learning Plan</h1>
        
        {error && (
          <div className="error-message" onClick={() => setError(null)}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={plan.title}
              onChange={handleChange}
              required
              placeholder="Enter plan title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={plan.description}
              onChange={handleChange}
              required
              placeholder="Describe your learning plan"
            />
          </div>

          <div className="topics-section">
            <h2>Topics</h2>
            {plan.topics.map((topic, index) => (
              <div key={index} className="topic-group">
                <div className="topic-header">
                  <h3>Topic {index + 1}</h3>
                  {plan.topics.length > 1 && (
                    <button
                      type="button"
                      className="remove-topic"
                      onClick={() => removeTopic(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor={`topic-title-${index}`}>Title</label>
                  <input
                    type="text"
                    id={`topic-title-${index}`}
                    name={`topic.title`}
                    value={topic.title}
                    onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                    required
                    placeholder="Enter topic title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`topic-description-${index}`}>Description</label>
                  <textarea
                    id={`topic-description-${index}`}
                    name={`topic.description`}
                    value={topic.description}
                    onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                    required
                    placeholder="Describe the topic"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`topic-resources-${index}`}>Resources</label>
                  <textarea
                    id={`topic-resources-${index}`}
                    name={`topic.resources`}
                    value={topic.resources}
                    onChange={(e) => handleTopicChange(index, 'resources', e.target.value)}
                    placeholder="Add learning resources (links, books, etc.)"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="add-topic"
              onClick={addTopic}
            >
              Add Topic
            </button>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(`/plan/${id}`)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLearningPlanForm;
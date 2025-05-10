import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import './LearningPlanForm.css';

const LearningPlanForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topics: [{ title: '', description: '', resources: '' }]
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('topic')) {
      const topicField = name.split('.')[1];
      const newTopics = [...formData.topics];
      newTopics[index] = {
        ...newTopics[index],
        [topicField]: value
      };
      setFormData({ ...formData, topics: newTopics });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addTopic = () => {
    setFormData({
      ...formData,
      topics: [...formData.topics, { title: '', description: '', resources: '' }]
    });
  };

  const removeTopic = (index) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const sessionData = localStorage.getItem('skillhub_user_session');
      if (!sessionData) {
        throw new Error('Please login to create a learning plan');
      }

      const userData = JSON.parse(sessionData);
      
      // Format the data according to backend expectations
      const planData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        userId: userData.email,
        status: 'IN_PROGRESS',
        topics: formData.topics.map(topic => ({
          name: topic.title.trim(),
          description: topic.description.trim(),
          resources: [{
            name: topic.resources ? topic.resources.trim() : '',
            url: '',
            type: 'OTHER'
          }]
        }))
      };

      console.log('Sending plan data:', planData); // Debug log

      const response = await axiosInstance.post('/plans', planData);
      
      if (response.data) {
        navigate(`/plan/${response.data.id}`);
      }
    } catch (err) {
      console.error('Error creating plan:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || 'Failed to create learning plan. Please check your input and try again.');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Unable to connect to the server. Please check if the backend is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="learning-plan-form">
      <div className="form-container">
        <h1>Create Learning Plan</h1>
        
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
              value={formData.title}
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
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your learning plan"
            />
          </div>

          <div className="topics-section">
            <h2>Topics</h2>
            {formData.topics.map((topic, index) => (
              <div key={index} className="topic-group">
                <div className="topic-header">
                  <h3>Topic {index + 1}</h3>
                  {formData.topics.length > 1 && (
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
                    onChange={(e) => handleChange(e, index)}
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
                    onChange={(e) => handleChange(e, index)}
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
                    onChange={(e) => handleChange(e, index)}
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
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/plans')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LearningPlanForm;
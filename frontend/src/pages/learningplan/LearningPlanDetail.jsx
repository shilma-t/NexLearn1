import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import { FaPencilAlt, FaTrash, FaShare, FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../../utils/axios';
import SharePlanModal from './SharePlanModal';
import Sidebar from '../../components/sidebar/sidebar';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Get current user email from session
  const sessionData = localStorage.getItem('skillhub_user_session');
  const currentUserEmail = sessionData ? JSON.parse(sessionData).email : null;
  const isOwner = plan && plan.userId === currentUserEmail;

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
            id: response.data.id || response.data._id
          };
          setPlan(planData);
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

  const handleShareWithAll = async () => {
    if (window.confirm('Are you sure you want to share this plan with all users?')) {
      try {
        await axiosInstance.post(`/plans/${id}/share/all`);
        setError('Plan shared successfully with all users!');
        // Refresh the plan data
        const response = await axiosInstance.get(`/plans/${id}`);
        if (response && response.data) {
          setPlan(response.data);
        }
      } catch (err) {
        setError(`Failed to share learning plan: ${err.message || 'Unknown error'}`);
        console.error('Error sharing plan:', err);
      }
    }
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
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
        <Sidebar />
        <main style={{
          marginLeft: '260px',
          width: '100%',
          padding: '80px 32px 40px',
          background: '#000',
          color: '#fff',
          minHeight: '100vh',
        }}>
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
        <Sidebar />
        <main style={{
          marginLeft: '260px',
          width: '100%',
          padding: '80px 32px 40px',
          background: '#000',
          color: '#fff',
          minHeight: '100vh',
        }}>
          <Alert variant="danger" style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
            {error}
            <div className="mt-3">
              <Button 
                variant="primary" 
                onClick={() => navigate('/plans')}
                style={{ background: '#4b0076', border: 'none' }}
              >
                Return to Plans
              </Button>
            </div>
          </Alert>
        </main>
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
        <Sidebar />
        <main style={{
          marginLeft: '260px',
          width: '100%',
          padding: '80px 32px 40px',
          background: '#000',
          color: '#fff',
          minHeight: '100vh',
        }}>
          <Alert variant="warning" style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
            Learning plan not found
            <div className="mt-3">
              <Button 
                variant="primary" 
                onClick={() => navigate('/plans')}
                style={{ background: '#4b0076', border: 'none' }}
              >
                Return to Plans
              </Button>
            </div>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      <Sidebar />
      <main style={{
        marginLeft: '260px',
        width: '100%',
        padding: '80px 32px 40px',
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Button 
            variant="link" 
            onClick={() => navigate(-1)}
            style={{ 
              color: '#fff', 
              textDecoration: 'none',
              padding: 0,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowLeft /> Back
          </Button>

          <Card style={{ background: '#181818', border: '1px solid #333', borderRadius: 16 }}>
            <Card.Header style={{ 
              background: '#181818', 
              borderBottom: '1px solid #333',
              padding: '20px'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <h2 style={{ color: '#fff', margin: 0 }}>{plan.title}</h2>
                {isOwner && (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="link" 
                      onClick={handleEdit}
                      style={{ 
                        color: '#fff',
                        padding: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaPencilAlt size={20} />
                    </Button>
                    <Button 
                      variant="link" 
                      onClick={handleDelete}
                      style={{ 
                        color: '#fff',
                        padding: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaTrash size={20} />
                    </Button>
                    <Button 
                      variant="link" 
                      onClick={handleShareWithAll}
                      style={{ 
                        color: '#fff',
                        padding: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaShare size={20} />
                    </Button>
                  </div>
                )}
              </div>
            </Card.Header>
            <Card.Body style={{ padding: '20px' }}>
              <div className="mb-4">
                <h4 style={{ color: '#fff', marginBottom: '10px' }}>Description</h4>
                <p style={{ color: '#ccc' }}>{plan.description}</p>
              </div>

              <div className="mb-4">
                <h4 style={{ color: '#fff', marginBottom: '20px' }}>Learning Topics</h4>
                {plan.topics && plan.topics.length > 0 ? (
                  <div className="topics-list">
                    {plan.topics.map((topic, index) => (
                      <Card key={index} style={{ 
                        background: '#2a2a2a', 
                        border: '1px solid #333',
                        marginBottom: '20px',
                        borderRadius: '8px'
                      }}>
                        <Card.Body>
                          <h5 style={{ color: '#fff', marginBottom: '10px' }}>{topic.name}</h5>
                          <p style={{ color: '#ccc', marginBottom: '15px' }}>{topic.description}</p>
                          
                          {topic.resources && topic.resources.length > 0 && (
                            <div className="resources-section">
                              <h6 style={{ color: '#fff', marginBottom: '10px' }}>Resources:</h6>
                              {topic.resources.map((resource, resIndex) => (
                                <div key={resIndex} style={{ 
                                  background: '#181818', 
                                  padding: '15px',
                                  borderRadius: '6px',
                                  color: '#ccc',
                                  whiteSpace: 'pre-wrap',
                                  marginBottom: '10px'
                                }}>
                                  {resource.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#ccc' }}>No topics added to this learning plan yet.</p>
                )}
              </div>

              <div className="mt-4">
                <small style={{ color: '#888' }}>
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                  {plan.updatedAt && ` • Last updated: ${new Date(plan.updatedAt).toLocaleDateString()}`}
                </small>
              </div>
            </Card.Body>
            <Card.Footer style={{ 
              background: '#181818', 
              borderTop: '1px solid #333',
              padding: '16px 20px'
            }}>
              <Badge 
                bg="info" 
                style={{ 
                  background: '#17a2b8',
                  padding: '8px 16px',
                  borderRadius: '4px'
                }}
              >
                Status: {plan.status}
              </Badge>
            </Card.Footer>
          </Card>

          <SharePlanModal
            show={showShareModal}
            onHide={() => setShowShareModal(false)}
            onShare={handleShareSubmit}
          />
        </div>
      </main>
    </div>
  );
};

export default LearningPlanDetail;
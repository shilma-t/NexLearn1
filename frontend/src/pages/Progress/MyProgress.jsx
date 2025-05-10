import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';
import axiosInstance from '../../utils/axios';
import Sidebar from '../../components/sidebar/sidebar';
import Toast from '../../components/Toast';

const MyProgress = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        const response = await axiosInstance.get('/progress/my-progress');
        setProgressUpdates(response.data);
      } catch (error) {
        setError('Error fetching progress updates');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressUpdates();
  }, []);

  const handleEdit = (update) => {
    // Implement edit functionality
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/progress/${deleteId}`);
      setProgressUpdates(progressUpdates.filter(update => update._id !== deleteId));
      setShowDeleteModal(false);
      setToastMessage('Progress update deleted successfully');
      setShowToast(true);
    } catch (error) {
      setError('Error deleting progress update');
    }
  };

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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

          <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: 32 }}>My Progress</h2>
          {error && (
            <Alert variant="danger" style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
              {error}
            </Alert>
          )}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Row>
              {progressUpdates.map((update) => (
                <Col key={update._id} md={4} className="mb-4">
                  <Card style={{ background: '#181818', color: '#fff', border: '1px solid #333', borderRadius: 16 }}>
                    <Card.Body>
                      <Card.Title style={{ color: '#fff' }}>{update.title}</Card.Title>
                      <Card.Text style={{ color: '#ccc' }}>{update.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-muted" style={{ color: '#aaa' }}>Status: </span>
                          <span style={{ 
                            color: update.status === 'completed' ? '#28a745' : 
                                  update.status === 'in_progress' ? '#ffc107' : '#dc3545'
                          }}>
                            {update.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="link" 
                            onClick={() => handleEdit(update)}
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
                            onClick={() => handleDeleteClick(update._id)}
                            style={{ 
                              color: '#fff',
                              padding: '8px',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <FaTrash size={20} />
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer style={{ background: '#181818', color: '#aaa', borderTop: '1px solid #333' }}>
                      Last updated: {new Date(update.updatedAt).toLocaleDateString()}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        contentClassName="bg-dark"
      >
        <Modal.Header 
          closeButton 
          style={{ 
            background: '#181818', 
            borderBottom: '1px solid #333',
            color: '#fff'
          }}
        >
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#181818', color: '#fff' }}>
          Are you sure you want to delete this progress update? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer style={{ 
          background: '#181818', 
          borderTop: '1px solid #333'
        }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            style={{ 
              background: '#6c757d', 
              border: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            style={{ 
              background: '#dc3545', 
              border: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
      />
    </div>
  );
};

export default MyProgress; 
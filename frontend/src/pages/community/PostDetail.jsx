import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { FaPencilAlt, FaTrash, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import axiosInstance from '../../utils/axios';
import Sidebar from '../../components/sidebar/sidebar';
import Toast from '../../components/Toast';
import styles from './PostDetail.module.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      setPost(response.data);
      setEditedTitle(response.data.title);
      setEditedContent(response.data.content);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/posts/${id}`, {
        title: editedTitle,
        content: editedContent
      });
      setPost({ ...post, title: editedTitle, content: editedContent });
      setIsEditing(false);
      setSuccessMessage('Post updated successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      setError('Failed to update post');
      setToastMessage('Failed to update post');
      setShowToast(true);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/posts/${id}`);
      setShowDeleteModal(false);
      setSuccessMessage('Post deleted successfully!');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/community');
      }, 1800);
    } catch (err) {
      setError('Failed to delete post');
      setToastMessage('Failed to delete post');
      setShowToast(true);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className={styles.postDetailContainer}>
      <Sidebar />
      <main className={styles.postDetailMain}>
        <div className={styles.centeredContent}>
          <Button 
            variant="link" 
            onClick={() => navigate(-1)}
            style={{ textDecoration: 'none', padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaArrowLeft /> Back
          </Button>

          {isEditing ? (
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: '#fff' }}>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  required
                  className={styles.darkInput}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: '#fff' }}>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  required
                  className={styles.darkInput}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button 
                  type="submit" 
                  variant="primary"
                  style={{ background: '#4b0076', border: 'none', transition: 'all 0.3s ease' }}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditing(false)}
                  style={{ background: '#6c757d', border: 'none', transition: 'all 0.3s ease' }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <Card className={styles.darkCard}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Card.Title style={{ color: '#fff', margin: 0 }}>{post.title}</Card.Title>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="link" 
                      onClick={() => setIsEditing(true)}
                      className={styles.neutralIconBtn}
                    >
                      <FaPencilAlt size={20} />
                    </Button>
                    <Button 
                      variant="link" 
                      onClick={handleDeleteClick}
                      className={styles.neutralIconBtn}
                    >
                      <FaTrash size={20} />
                    </Button>
                  </div>
                </div>
                <Card.Text style={{ color: '#ccc' }}>{post.content}</Card.Text>
              </Card.Body>
            </Card>
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
          className={styles.darkModalHeader}
        >
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.darkModalBody}>
          Are you sure you want to delete this post? <b>This action cannot be undone.</b>
        </Modal.Body>
        <Modal.Footer className={styles.darkModalFooter}>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            style={{ background: '#6c757d', border: 'none', transition: 'all 0.3s ease' }}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            style={{ background: '#dc3545', border: 'none', transition: 'all 0.3s ease' }}
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
        type={error ? 'error' : 'success'}
      />

      {showSuccess && (
        <div className={styles.successPopupOverlay}>
          <div className={styles.successPopup}>
            <FaCheckCircle size={48} style={{ marginBottom: 16 }} />
            <div className={styles.successPopupText}>{successMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail; 
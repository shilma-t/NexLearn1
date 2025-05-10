import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axios';
import Sidebar from '../../components/sidebar/sidebar';
import Toast from '../../components/Toast';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/posts', {
        title,
        content
      });
      setToastMessage('Post created successfully!');
      setShowToast(true);
      // Navigate after a short delay to show the toast
      setTimeout(() => {
        navigate('/community');
      }, 1500);
    } catch (err) {
      setError('Failed to create post');
      setToastMessage('Failed to create post');
      setShowToast(true);
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: 32 }}>Create New Post</h2>
          {error && (
            <div className="alert alert-danger" style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
              {error}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#fff' }}>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ 
                  background: '#2a2a2a', 
                  color: '#fff', 
                  border: '1px solid #333',
                  '&:focus': {
                    background: '#2a2a2a',
                    color: '#fff',
                    borderColor: '#4b0076'
                  }
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#fff' }}>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ 
                  background: '#2a2a2a', 
                  color: '#fff', 
                  border: '1px solid #333',
                  '&:focus': {
                    background: '#2a2a2a',
                    color: '#fff',
                    borderColor: '#4b0076'
                  }
                }}
              />
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary"
              style={{ 
                background: '#4b0076', 
                border: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Create Post
            </Button>
          </Form>
        </div>
      </main>

      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={error ? 'error' : 'success'}
      />
    </div>
  );
};

export default CreatePost; 
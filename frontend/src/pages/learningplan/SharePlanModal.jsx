import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SharePlanModal = ({ show, onHide, onShare }) => {
  const [userId, setUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim()) {
      onShare(userId);
      setUserId('');
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
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
        <Modal.Title>Share Learning Plan</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ background: '#181818', color: '#fff' }}>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: '#fff' }}>User ID to share with</Form.Label>
            <Form.Control
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
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
        </Modal.Body>
        <Modal.Footer style={{ 
          background: '#181818', 
          borderTop: '1px solid #333'
        }}>
          <Button 
            variant="secondary" 
            onClick={onHide}
            style={{ 
              background: '#6c757d', 
              border: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            style={{ 
              background: '#4b0076', 
              border: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            Share
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SharePlanModal;
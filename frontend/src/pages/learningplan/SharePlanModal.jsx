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
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Share Learning Plan</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User ID to share with</Form.Label>
            <Form.Control
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Share
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SharePlanModal;
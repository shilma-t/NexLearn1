import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const SharePlanModal = ({ show, onHide, onSubmit }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError(''); // Clear any previous errors
      await onSubmit();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onHide();
      }, 2000);
    } catch (err) {
      console.error('Failed to share plan:', err);
      setError('Failed to share plan. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton style={{ backgroundColor: '#2c2c2c', color: 'white' }}>
        <Modal.Title style={{ color: 'white' }}>Share Learning Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#2c2c2c', color: 'white' }}>
        {error && (
          <Alert
            variant="danger"
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              borderColor: '#dc3545',
            }}
          >
            {error}
          </Alert>
        )}
  
        {success ? (
          <Alert
            variant="success"
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              borderColor: '#28a745',
            }}
          >
            Plan shared successfully! You can view it in the "View Shared Plans" tab.
          </Alert>
        ) : (
          <div>
            <p>This plan will be available in the "View Shared Plans" tab.</p>
            <Button variant="primary" onClick={handleSubmit}>
              Share Plan
            </Button>
            <Button variant="outline-secondary" className="ms-2" onClick={onHide}>
              Cancel
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
  
};

export default SharePlanModal;
import React from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';

const Toast = ({ show, onClose, message, type = 'success' }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      <BootstrapToast
        show={show}
        onClose={onClose}
        delay={3000}
        autohide
        style={{
          background: type === 'success' ? '#28a745' : '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <BootstrapToast.Header
          closeButton
          style={{
            background: type === 'success' ? '#28a745' : '#dc3545',
            color: '#fff',
            border: 'none',
          }}
        >
          <strong className="me-auto">
            {type === 'success' ? 'Success!' : 'Error!'}
          </strong>
        </BootstrapToast.Header>
        <BootstrapToast.Body>{message}</BootstrapToast.Body>
      </BootstrapToast>
    </div>
  );
};

export default Toast; 
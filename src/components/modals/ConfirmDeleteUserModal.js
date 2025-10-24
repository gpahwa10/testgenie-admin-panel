import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';

const ConfirmDeleteUserModal = ({ isOpen, toggle, onConfirm, userName, userEmail }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="sm">
      <ModalHeader toggle={toggle}>Confirm Delete User</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <p className="mb-2">
            Are you sure you want to delete this user?
          </p>
          <div className="bg-light p-3 rounded mb-3">
            <strong>{userName}</strong>
            <br />
            <small className="text-muted">{userEmail}</small>
          </div>
          <p className="text-danger small mb-0">
            <i className="fas fa-exclamation-circle me-1"></i>
            This action cannot be undone and will permanently remove all user data.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={onConfirm}>
          <i className="fas fa-trash me-1"></i>
          Delete User
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDeleteUserModal;

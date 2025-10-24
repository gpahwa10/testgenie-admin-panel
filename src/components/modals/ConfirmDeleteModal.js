import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';

const ConfirmDeleteModal = ({ isOpen, toggle, onConfirm, boardName }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="sm">
      <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <p className="mb-0">
            Are you sure you want to delete <strong>"{boardName}"</strong>?
          </p>
          <p className="text-muted small mt-2">
            This action cannot be undone.
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="danger" onClick={onConfirm}>
          Delete Board
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDeleteModal;

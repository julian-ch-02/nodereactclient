import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = ({
  modalConfirm,
  action,
  content,
  handleEdit,
  handleDelete,
  setModalConfirm,
}) => {
  return (
    <Modal show={modalConfirm} onHide={setModalConfirm}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "red", fontWeight: "bolder" }}>
        {content}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            setModalConfirm(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={
            action == "edit"
              ? handleEdit
              : action == "delete"
              ? handleDelete
              : ""
          }
          variant="success"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;

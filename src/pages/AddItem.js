import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import UploadImage from "../component/UploadImage";
import { CREATE_ITEM } from "../gql/mutation";
import { GET_ITEM } from "../gql/query";
import { toast } from "react-toastify";

const AddItem = ({ modalAdd, setModalAdd }) => {
  const [values, setValues] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [addItem] = useMutation(CREATE_ITEM, {
    update(_, data) {
      setLoading(false);
      setModalAdd();
      toast("Add Successfully", {
        theme: "colored",
        type: "success",
        autoClose: 1000,
      });
    },
    onError(err) {
      console.log(err);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    addItem({ variables: values, refetchQueries: [{ query: GET_ITEM }] });
  };
  return (
    <Modal
      show={modalAdd}
      onHide={loading ? () => {} : setModalAdd}
      backdrop={loading ? "static" : true}
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Item</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Item
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="content"
                disabled={loading && true}
                autoComplete="off"
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            </Col>
          </Form.Group>
          <UploadImage
            loading={loading}
            values={values}
            setLoading={setLoading}
            setValues={setValues}
            error={error}
            setError={setError}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={loading && true}
            onClick={() => {
              setModalAdd();
            }}
          >
            Close
          </Button>
          <Button variant="primary" type="submit" disabled={loading && true}>
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddItem;

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ITEM } from "../gql/query";
import { DELETE_ITEM, UPDATE_ITEM, DELETE_IMAGE } from "../gql/mutation";
import {
  Container,
  Table,
  Image,
  Button,
  Modal,
  Form,
  Col,
} from "react-bootstrap";
import Loading from "../component/Loading";
import Navbar from "../component/Navbar";
import { getToken } from "../authToken";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationModal from "../component/ConfirmationModal";

const Dashboard = () => {
  const [values, setValues] = useState({});
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [images, setImages] = useState([]);
  const { data, loading } = useQuery(GET_ITEM);
  const [content, setContent] = useState("");
  const [action, setAction] = useState("");

  const [deleteItem] = useMutation(DELETE_ITEM, {
    update(_, data) {
      setModalConfirm();
      const { token } = getToken();
      axios
        .post(
          process.env.REACT_APP_DELETE_IMAGE,
          {
            image: data.data.deleteItem.images,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          toast("Delete Successfully", {
            type: "warning",
            theme: "colored",
            autoClose: 1000,
          });
        })
        .catch((err) => console.log(err));
    },
    onError(err) {
      console.log(err);
    },
  });
  const [updateItem] = useMutation(UPDATE_ITEM, {
    update() {
      setModalConfirm();
      toast("Edit Successfully", {
        type: "success",
        theme: "colored",
        autoClose: 1000,
      });
    },
  });
  const [deleteImage] = useMutation(DELETE_IMAGE, {
    update(_, data) {
      const { token } = getToken();
      axios
        .post(
          process.env.REACT_APP_DELETE_IMAGE,
          {
            image: data.data.deleteImage.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setModal();
        })
        .catch((err) => console.log(err));
    },
    onError(err) {
      console.log(err);
    },
  });

  const handleEdit = () => {
    updateItem({
      variables: { id: values.id, content: values.content },
      refetchQueries: [{ query: GET_ITEM }],
    });
  };

  const handleDelete = () => {
    const { id } = values;
    deleteItem({ variables: { id }, refetchQueries: [{ query: GET_ITEM }] });
  };

  const handleDeleteImage = (e) => {
    deleteImage({
      variables: { name: e.name, item_id: values.id },
      refetchQueries: [{ query: GET_ITEM }],
    });
  };

  if (loading) {
    return (
      <Container fluid>
        <Loading />
      </Container>
    );
  }
  return (
    <>
      <Navbar />
      <Container>
        <Table
          className="text-center mt-5"
          striped
          responsive
          bordered
          hover
          size="sm"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.getItems.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="align-middle">{data.content}</td>
                  <td className="align-middle">
                    <Button
                      title="Images"
                      style={{ borderRadius: "40%" }}
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setImages(data.images);
                        setValues(data);
                        setModal(true);
                      }}
                    >
                      <i className="fas fa-images"></i>
                    </Button>
                    <Button
                      title="Edit"
                      style={{ borderRadius: "40%" }}
                      size="sm"
                      className="me-2"
                      variant="info"
                      onClick={() => {
                        setValues(data);
                        setModalEdit(true);
                      }}
                    >
                      <i className="fas fa-cog"></i>
                    </Button>
                    <Button
                      title="Delete"
                      style={{ borderRadius: "40%" }}
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalConfirm(true);
                        setContent("Are you sure?");
                        setValues(data);
                        setAction("delete");
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
      {/* Show image Modal */}
      <Modal show={modal} onHide={setModal}>
        <Modal.Header closeButton>
          <Modal.Title>Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {images.length <= 0
            ? "No Images"
            : images.map((data, index) => {
                return (
                  <span key={index}>
                    <Image className="mb-1 w-100" src={data.name} />
                  </span>
                );
              })}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Modal */}
      <Modal show={modalEdit} onHide={setModalEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setModalEdit(false);
            setModalConfirm(true);
            setContent("Are you sure?");
            setAction("edit");
          }}
        >
          <Modal.Body>
            <Form.Label column sm="2">
              Item
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="content"
                disabled={loading && true}
                value={values.content}
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setModalEdit(false);
              }}
            >
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <ConfirmationModal
        modalConfirm={modalConfirm}
        setModalConfirm={setModalConfirm}
        action={action}
        values={values}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        content={content}
      />
    </>
  );
};

export default Dashboard;

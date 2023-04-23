import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function Profile({ user, showModal, setShowModal }) {
  const modelClose = () => {
    setShowModal(false);
  };
  return (
    <div>
      <Modal show={showModal} onHide={modelClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">{user.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={user.pic}
            alt=""
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <h5 className="mt-3">Email : {user.email}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modelClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

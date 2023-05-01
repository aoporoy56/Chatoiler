import React, { useState } from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

export default function CreateGroup({ value, handleValue }) {
  
  const { user, chat, setChat, setSelectedChat } = ChatState();
  const [groupName, setGroupName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const handleClose = () => {
    handleValue(false);
  };
  const addUser = (getUser) => {
    setSelectedUser([...selectedUser, getUser]);
    selectedUser.map((user) => {
      if (user === getUser) {
        setSelectedUser(selectedUser.filter((user) => user !== getUser));
      }
    });
  };
  const deleteUser = (userId) => {
    setSelectedUser(selectedUser.filter((user) => user._id !== userId));
  };
  const searchHandle = async (e) => {
    try {
      const { data } = await axios.get("api/user?search=" + e.target.value, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchResult(data);
    } catch (error) {
      console.log("Error");
    }
  };
  const createGroup = async () => {
    if (!groupName || !selectedUser) {
      console.log("Input Full Fill");
    } else {
      try {
        const { data } = await axios.post(
          "/api/chat/group",
          {
            name: groupName,
            users: JSON.stringify(selectedUser.map((u) => u._id)),
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        handleClose();
        if(data)
        setSelectedChat(data);
         setChat([data, ...chat]);
         setGroupName("");
         setSearchResult([]);
         setSelectedUser([]);
      } catch (error) {
        console.log("Error");
      }
    }
  };
  return (
    <div>
      <Modal show={value} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="Group Name"
                onChange={(e) => setGroupName(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Control
                type="text"
                placeholder="Add User Name"
                onChange={searchHandle}
                
              />
            </Form.Group>
          </Form>
          <div>
            {selectedUser &&
              selectedUser.map((user) => (
                <Badge bg="secondary" className="me-2">
                  {user.name} <RxCross2 onClick={() => deleteUser(user._id)} />
                </Badge>
              ))}
          </div>
          <div>
            {searchResult &&
              searchResult.map((user) => (
                <div className="single-user" onClick={() => addUser(user)}>
                  <img
                    src={user.pic}
                    alt=""
                    width={"30px"}
                    style={{ borderRadius: "50%" }}
                  />
                  <div className="user-info">
                    <h6 className="m-0">{user.name}</h6>
                    <p>
                      <b>Email : </b> {user.email}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={createGroup}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

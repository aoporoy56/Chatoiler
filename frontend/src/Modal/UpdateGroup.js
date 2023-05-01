import React, { useEffect } from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { ChatState } from "../Context/ChatProvider";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import axios from "axios";
import GropuSearchList from "../Components/GropuSearchList";

export default function UpdateGroup({
  setFetchAgain,
  groupChat,
  setShowUpdateGroupModal,
  showUpdateGroupModal,
}) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  //   const [newUserList, setNewUserList] = useState([]);

  const [searchUsers, setSearchUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newGroupName, setNewGroupName] = useState();
  const [selectedUser, setSelectedUser] = useState(
    groupChat.users.filter((u) => u._id !== user._id)
  );
  const handleClose = () => {
    setShowUpdateGroupModal(false);
  };
  const removeUser = async (userID) => {
    const { data } = await axios.post(
      "/api/chat/memberRemove",
      {
        chatId: groupChat._id,
        userId: userID,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    if (data) {
      setSelectedUser(selectedUser.filter((u) => u._id !== userID));
      setSearchUsers([]);
      setSearchKeyword("");
    }
  };
  const searchUser = async (e) => {
    const { data } = await axios("/api/user?search=" + e.target.value, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (data) {
      setSearchUsers(
        data.filter((allUser) => {
          return !selectedUser.some(
            (alreadyUser) => alreadyUser._id === allUser._id
          );
        })
      );
    }
  };

  const nameUpdate = async () => {
    const { data } = await axios.post(
      "/api/chat/rename",
      {
        chatId: groupChat._id,
        chatName: newGroupName,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    if (data) {
      setShowUpdateGroupModal(false);
      setSelectedChat(groupChat);
      setFetchAgain(data);
    }
  };

  return (
    <div>
      <Modal show={showUpdateGroupModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{groupChat.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3 d-flex">
              <Form.Group
                className="w-100"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Control
                  type="text"
                  placeholder="New Group Name"
                  defaultValue={groupChat.chatName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  autoFocus
                />
              </Form.Group>
              <Button onClick={nameUpdate}>Update</Button>
            </div>
            <div className="mb-2">
              {selectedUser &&
                selectedUser.map((user) => (
                  <Badge bg="secondary" className="me-2">
                    {user.name}
                    <RxCross2 onClick={() => removeUser(user._id)} />
                  </Badge>
                ))}
            </div>
            {/* <div className="mb-2">
              {newUserList &&
                newUserList.map((user) => (
                  <Badge bg="info" className="me-2">
                    {user.name}
                    <RxCross2 onClick={() => removeFromList(user._id)} />
                  </Badge>
                ))}
            </div> */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Control
                type="text"
                placeholder="Search new member"
                onChange={searchUser}
                autoFocus
              />
              <div className="mt-2">
                {searchUsers &&
                  searchUsers.map((userData) => (
                    <GropuSearchList
                      setSearchKeyword={setSearchKeyword}
                      searchUser={searchUser}
                      setSearchUsers={setSearchUsers}
                      groupChat={groupChat}
                      userData={userData}
                      setSelectedUser={setSelectedUser}
                      selectedUser={selectedUser}
                    />
                  ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

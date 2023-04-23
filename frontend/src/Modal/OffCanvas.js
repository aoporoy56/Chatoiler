import React, { useEffect, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import "./OffCanvas.css";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import SearchResultUser from "../Components/SearchResultUser";

export default function OffCanvas({ value, valueChange }) {
  const { user, selectedChat, setSelectedChat, setChat, chat } = ChatState();
  const [users, setUsers] = useState();
  const handleClose = () => {
    valueChange(false);
    setUsers([])
  };
  const [input, setInput] = useState();

  return (
    <div>
      <Offcanvas show={value} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search User</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="search">
            <Form.Control
              type="text"
              placeholder="Search"
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <Button
              onClick={async () => {
                const users = await axios.get("/api/user?search=" + input, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                });
                setUsers(users.data);
              }}
            >
              <BsSearch />
            </Button>
          </div>
          <div className="search-result">
            
            {users && users.map((user) => {return <SearchResultUser key={user._id} value={user} canvasHandle={handleClose} />})}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

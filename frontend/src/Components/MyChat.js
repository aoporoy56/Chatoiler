import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { Button } from "react-bootstrap";
import { GrFormAdd } from "react-icons/gr";
import SingleChat from "./SingleChat";
import CreateGroup from "../Modal/CreateGroup";

export default function MyChat({ fetchAgain }) {
  const { user, setUser, selectedChat, setSelectedChat, chat, setChat } =
    ChatState();
  const [createGroupShow, setCreateGroupShow] = useState(false);
  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChat(data);
    } catch (error) {
      console.log("Failed to load");
      fetchChats();
    }
    
    if (selectedChat) {
      setSelectedChat(setSelectedChat);
    }
  };
  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);
  return (
    <div
      className="col-md-4 p-3"
      style={{
        overflow: "auto",
        background: "white",
        height: "100%",
        borderRadius: "20px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h3>My Chat</h3>
        <Button onClick={() => setCreateGroupShow(true)}>
          <GrFormAdd style={{ color: "white" }} /> New Group
        </Button>
      </div>
      <CreateGroup value={createGroupShow} handleValue={setCreateGroupShow} />

      <div
        className="mt-3"
      >
        {chat && chat.map((singleUser) => <SingleChat key={singleUser._id} value={singleUser} />)}
      </div>
    </div>
  );
}

import React from "react";
import { ChatState } from "../Context/ChatProvider";

export default function SingleChat({ value }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  console.log(value)
  return (
    <div
      onClick={() => setSelectedChat(value)}
      style={{
        marginTop: "10px",
        padding: "8px 20px",
        background: `${selectedChat === value ? "#87aaf4" : "#e8e8e8"}`,
        borderRadius: "15px",
        display: "flex",
      }}
    >
      {!value.isGroupChat && (
        <img
          src={
            value.users[1]._id === user._id
              ? value.users[0].pic
              : value.users[1].pic
          }
          alt=""
          width={"40px"}
          style={{ borderRadius: "30px", marginRight: "10px" }}
        />
      )}
      <>
        <h5 className="m-0">
          {value.isGroupChat ? value.chatName : ""}
          {!value.isGroupChat
            ? value.users[1]._id === user._id
              ? value.users[0].name
              : value.users[1].name
            : ""}
        </h5>

        <h6>{/* <b>John Due : </b> {value.letestMessage} */}</h6>
      </>
    </div>
  );
}

import axios from "axios";
import React from "react";
import { ChatState } from "../Context/ChatProvider";

export default function GropuSearchList({
  groupChat,
  userData,
  setSelectedUser,
  selectedUser,
  setSearchUsers,
  searchUser,
  setSearchKeyword,
}) {
  const { user } = ChatState();
  const addMember = async () => {
    if (selectedUser.some((u) => u._id === userData._id)) {
      return;
    }
    const { data } = await axios.post(
      "/api/chat/memberAdd",
      {
        chatId: groupChat._id,
        userId: userData._id,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    if (data) {
      setSelectedUser([...selectedUser, userData]);
      setSearchUsers([]);
      setSearchKeyword("");
    }
  };
  return (
    <div className="d-flex" onClick={addMember}>
      <img
        src={userData.pic}
        alt=""
        width={"40px"}
        height={"40px"}
        style={{
          borderRadius: "50%",
          marginRight: "10px",
          marginBottom: "10px",
        }}
      />
      <h4>{userData.name}</h4>
    </div>
  );
}

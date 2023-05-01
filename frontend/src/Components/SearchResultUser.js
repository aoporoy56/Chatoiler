import React from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";

export default function SearchResultUser({ value, canvasHandle }) {
  const { user, setSelectedChat, chat, setChat } = ChatState();
  const selectUser = async (userId) => {
    try {
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (data) {
        console.log(data)
          setChat([data, ...chat]);
          setSelectedChat(data);
        
      }
      canvasHandle();
    } catch (error) {
      console.log("Error");
    }
  };
  return (
    <div>
      <div className="single-user" onClick={() => selectUser(value._id)}>
        <img
          src={value.pic}
          alt=""
          width={"30px"}
          style={{ borderRadius: "50%" }}
        />
        <div className="user-info">
          <h6 className="m-0">{value.name}</h6>
          <p>
            <b>Email : </b> {value.email}
          </p>
        </div>
      </div>
    </div>
  );
}

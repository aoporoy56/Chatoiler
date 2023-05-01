import React, {  useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import Header from "../Components/Header";
import "./Chats.css";
import { useNavigate } from "react-router-dom";
import MyChat from "../Components/MyChat";
import ChatBox from "../Components/ChatBox";

export default function Chats() {
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState();
  const { user }= ChatState();
  
  useEffect(()=>{
    if (!user) {
      navigate("/");
    }
  },[])

  return (
    <div className="chats">
      {user && <Header />}
      <div className="d-flex h-100">
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
}

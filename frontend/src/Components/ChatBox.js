import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Button, Form } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { GetSender } from "./../config/GetSender";
import Profile from "../Modal/Profile";
import axios from "axios";
import Messages from "./Messages";
import io from "socket.io-client";

const ENDPOINT = "https://chatoiler.onrender.com";
var socket, selectedChatCompare;

export default function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat, user } = ChatState();
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/message/" + selectedChat._id, {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      });
      if (data) {
        setMessageList(data);
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
    socket.emit("chat-join", selectedChat._id);
    // socket.on()
  };

  const messageHandle = (e) => {
    setNewMessage(e.target.value);
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter") {
      console.log(newMessage);
      try {
        const { data } = await axios.post(
          "/api/message/sendMessage",
          {
            chatId: selectedChat,
            content: newMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (data) {
          socket.emit("new-message", data);
          setFetchAgain(true);
          setMessageList([...messageList, data]);
          console.log(data);
          setNewMessage("");
          e.target.value = "";
        }
      } catch (error) {
        console.log(error.mess);
      }
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("join", user._id);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("Recieved Message", (recievedMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== recievedMessage.chat._id
      ) {
      } else {
        setMessageList([...messageList, recievedMessage]);
      }
    });
  });

  return (
    <>
      <div
        style={{
          background: "white",
          width: "100%",
          height: "12%",
          borderRadius: "15px",
          marginLeft: "15px",
          padding: "20px",
          height: "100%",
        }}
      >
        {loading ? (
          <div className="h-100 d-flex justify-content-center align-items-center display-4">
            Wait Dudu!!!
          </div>
        ) : (
          <>
            {selectedChat && !loading && (
              <div className="h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="m-0">
                    {
                      !selectedChat.isGroupChat &&
                        GetSender(selectedChat, user).name
                      // GetSender(selectedChat, user).name
                    }
                    {selectedChat.isGroupChat && selectedChat.chatName}
                  </h3>
                  {!selectedChat.isGroupChat && (
                    <div>
                      <Button onClick={() => setShowModal(true)}>
                        <CgProfile />
                      </Button>
                      <Profile
                        user={
                          selectedChat &&
                          !selectedChat.isGroupChat &&
                          GetSender(selectedChat, user)
                        }
                        setShowModal={setShowModal}
                        showModal={showModal}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    background: "#e8e8e8",
                    height: "85%",
                    borderRadius: "15px",
                    padding: "10px",
                  }}
                >
                  {messageList.length !== 0 ? (
                    <Messages messageList={messageList} />
                  ) : (
                    <div className="h-100 d-flex justify-content-center align-items-center display-4">
                      No Message Yet
                    </div>
                  )}
                </div>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Write message..."
                  onChange={messageHandle}
                  onKeyDown={sendMessage}
                />
              </div>
            )}
            {!selectedChat && (
              <div className="d-flex justify-content-center align-items-center h-100">
                <h2>Select Any Chat To Show Message</h2>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

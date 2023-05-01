import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Button, Form } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { GetSender } from "./../config/GetSender";
import Profile from "../Modal/Profile";
import axios from "axios";
import Messages from "./Messages";
import io from "socket.io-client";
import UpdateGroup from "../Modal/UpdateGroup";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

export default function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat, user } = ChatState();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typingAlert, setTypingAlert] = useState(false);
  const [isTypingAlert, setIsTypingAlert] = useState(false);
  console.log("Chat Bok");
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
    if (selectedChat) {
      socket.emit("chat-join", selectedChat._id);
    }
  };

  const messageHandle = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typingAlert) {
      setTypingAlert(true);
      socket.emit("typing", selectedChat._id);
    }

    socket.emit("typing", selectedChat._id);
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = (timeNow = lastTypingTime);
      if (timeDiff >= timerLength && typingAlert) {
        socket.emit("stop-typing", selectedChat._id);
        setTypingAlert(false);
      }
    }, timerLength);

  };
  const sendMessage = async (e) => {
    if (e.key === "Enter") {
      socket.emit("stop-typing", selectedChat._id);
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
          // setFetchAgain(true);
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
    socket.on("typing", () => setIsTypingAlert(true));
    socket.on("stop-typing", () => setIsTypingAlert(false));
  }, []);

  useEffect(() => {
    selectedChatCompare = selectedChat;
    fetchMessage();
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
    socket.on("typing", () => {
      setTypingAlert(true);
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
                  <h3 className="m-0" key={fetchAgain}>
                    {
                      !selectedChat.isGroupChat &&
                        GetSender(selectedChat, user).name
                      // GetSender(selectedChat, user).name
                    }
                    {selectedChat.isGroupChat && selectedChat.chatName}
                  </h3>
                  {!selectedChat.isGroupChat ? (
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
                  ) : (
                    <div>
                      <Button onClick={() => setShowUpdateGroupModal(true)}>
                        <CgProfile />
                      </Button>
                      <UpdateGroup
                        setFetchAgain={setFetchAgain}
                        groupChat={selectedChat}
                        setShowUpdateGroupModal={setShowUpdateGroupModal}
                        showUpdateGroupModal={showUpdateGroupModal}
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
                    <Messages
                      messageList={messageList}
                      typingAlert={typingAlert}
                    />
                  ) : (
                    <div className="h-100 d-flex justify-content-center align-items-center display-4">
                      No Message Yet
                    </div>
                  )}
                  {isTypingAlert ? <>Loading..</> : <></>}
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Write message..."
                    onChange={messageHandle}
                    onKeyDown={sendMessage}
                  />
                </div>
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

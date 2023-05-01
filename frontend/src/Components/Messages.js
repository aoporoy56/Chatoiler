import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isSameSender } from "../config/GetSender";
import { ChatState } from "../Context/ChatProvider";
export default function Messages({ messageList, typingAlert }) {
  const { user } = ChatState();
  console.log(messageList);
  return (
    <ScrollableFeed>
      {/* {messageList} */}
      {messageList &&
        messageList.map((message, i) => {
          return message.sender._id === user._id ? (
            <div className="d-flex justify-content-end" key={i}>
              <div
                style={{
                  background: "#0a68ff",
                  color: "white",
                  borderRadius: "15px",
                  padding: "5px 10px",
                  margin: "2px",
                  maxWidth: "300px",
                }}
              >
                {message.content}
              </div>
            </div>
          ) : (
            <div className="d-flex">
              <div
                style={{
                  background: "#f0ea46 ",
                  borderRadius: "15px",
                  padding: "5px 10px",
                  margin: "2px",
                  maxWidth: "300px",
                }}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      {/* //   isSameSender(messageList, i, message, user) ? (
        //     <div style={{ background: "green" }}>
        //       {message.content} : {message.sender.name}
        //     </div>
        //   ) : (
        //     <div style={{ background: "red" }}>
        //       {message.content} : {message.sender.name}
        //     </div>
        //   ) */}
    </ScrollableFeed>
  );
}

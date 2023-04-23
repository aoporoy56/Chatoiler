exports.GetSender = (selectedChat, user) => {
  return selectedChat.users[0]._id === user._id
    ? selectedChat.users[1]
    : selectedChat.users[0];
};

exports.isSameSender = (messageList, i, message, user) => {
  console.log(message)
  return (
      i < messageList.length -1 &&
    (
    message.sender._id === messageList[i+1].sender._id || 
    messageList[i + 1] == undefined) &&
    messageList[i].sender._id !== user._id
  )
}
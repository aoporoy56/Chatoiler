const { ChatModel } = require("../models/ChatModel");
const { MessageModel } = require("../models/MessageModel");
const { UserModel } = require("../models/UserModel");

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid Chat");
    return res.send("Error");
  }

  try {
    
    let message = await MessageModel.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });
    message = await message.populate("sender","name pic");
    message = await message.populate("chat")
    message = await UserModel.populate(message,{
        path : "chat.users",
        select : "name email pic"
    })
    // if(message){
    //   let leteastMessageAdd = await ChatModel.findByIdAndUpdate(chatId, {
    //   latestMessage : message
    // });
    // }
    // res.send({
    //   messageData: message,
    //   latestMessage : leteastMessageAdd
    // });
    res.send(message)
  } catch (err) {
    res.send(err);
  }
};
exports.allMessage = async (req,res) => {
    try {
        const message = await MessageModel.find({chat : req.params.chatId}).populate("sender","name email pic")
        .populate("chat")
        res.send(message);

    } catch (error) {
        res.status(400).send("Error")
    }
}
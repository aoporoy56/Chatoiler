const { ChatModel } = require("../models/ChatModel");
const { UserModel } = require("../models/UserModel");
exports.accessChat = async (req, res) => {
  const { userId } = req.body;
  console.log(req.user._id);
  console.log(userId);

  if (!userId) {
    console.log("User not found");
    res.sendStatus(400);
  }

  var isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await UserModel.populate(isChat, {
    path: "lastestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    console.log("Create Already");
    res.send(isChat);
  } else {
    console.log("Created");
    let chat = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await ChatModel.create(chat);
      const FullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};
exports.fetchChat = async (req, res) => {
  const fetchData = await ChatModel.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .sort({ updatedAt  : -1})
    .populate("users", "-password")
    .populate("latestMessage");
  res.status(200).send(fetchData);
};
exports.createGroup = async (req, res) => {
  const { users, name } = req.body;
  if (!users && !name) {
    res.status(400).send("Please Fill All Element");
  }
  const userList = JSON.parse(req.body.users);

  if (userList.length < 2) {
    res.status(400).send("More then 2 User must selected");
  }
  userList.push(req.user);
  try {
    const createGroup = await ChatModel.create({
      chatName: req.body.name,
      users: userList,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const groupData = await ChatModel.findOne({
      _id: createGroup._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).send(groupData);
  } catch (error) {
    res.status(400);

    throw new Error(error.message);
  }
};
exports.renameGroup = async (req, res) => {
  console.log(req.body);
  const update = await ChatModel.findByIdAndUpdate(
    req.body.chatId,
    {
      chatName: req.body.chatName,
    },
    {
      new: true,
    }
  );
  if (!update) {
    throw new Error("Update Error");
  } else {
    res.status(200).send(update);
  }
};

exports.memberAdd = async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(400).send("Group Member Add Faild");
    throw new Error("Person not Added");
  } else {
    console.log(added)
    res.json(added);
  }
};

exports.memberRemove = async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        users: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(400).send("Group Member Remove Faild");
    throw new Error("Person not Removed");
  } else {
    console.log(removed)
    res.json(removed);
  }
};

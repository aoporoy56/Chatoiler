const express = require("express");
const { middle } = require("../middleware/authMiddlewaare");
const { accessChat, fetchChat, createGroup, renameGroup, memberAdd, memberRemove } = require("../controller/ChatController");
const ChatRoute = express.Router();

ChatRoute.route("/").post(middle,accessChat);
ChatRoute.route("/").get(middle,fetchChat);
ChatRoute.route("/group").post(middle, createGroup);
ChatRoute.route("/rename").put(middle, renameGroup);
ChatRoute.route("/memberAdd").post(middle, memberAdd);
ChatRoute.route("/memberRemove").put(middle, memberRemove);


module.exports = ChatRoute;
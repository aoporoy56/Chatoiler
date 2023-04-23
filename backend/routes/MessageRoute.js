const express = require("express");
const { middle } = require("../middleware/authMiddlewaare");
const { sendMessage, allMessage } = require("../controller/MessageController");
const MessgeRoute = express.Router();


MessgeRoute.route("/sendMessage").post(middle,sendMessage);
MessgeRoute.route("/:chatId").get(middle,allMessage);

module.exports = MessgeRoute;
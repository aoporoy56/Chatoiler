const express = require("express");
const { register, login, allUser } = require("../controller/UserController");
const { middle } = require("../middleware/authMiddlewaare");
const UserRouter = express.Router();

UserRouter.post("/register",register);
UserRouter.post("/login",login)
UserRouter.route("/user").get(middle, allUser);

module.exports = UserRouter; 
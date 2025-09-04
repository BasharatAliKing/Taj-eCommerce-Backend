const express = require("express");
const router = express.Router();
const UserController = require("../controller/user-Controller");
const User = require("../models/user-model");
const authMiddleware=require("../middleware/auth-middleware")
router.route("/signup").post(UserController.Register);
router.route("/login").post(UserController.Login);
router.route("/user").get(authMiddleware,UserController.user);

module.exports = router;
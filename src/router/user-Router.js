const express = require("express");
const router = express.Router();
const UserController = require("../controller/user-Controller");
const User = require("../models/user-model");
const authMiddleware=require("../middleware/auth-middleware")
router.route("/signup").post(UserController.Register);
router.route("/login").post(UserController.Login);
router.route("/user").get(authMiddleware,UserController.user);
// Forgot Password
router.route("/forgot-password").post(UserController.forgotPassword);
// Reset Password
router.route("/reset-password/:token").post(UserController.resetPassword);
module.exports = router;


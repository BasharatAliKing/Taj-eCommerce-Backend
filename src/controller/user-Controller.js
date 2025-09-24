const express = require("express");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { forgotPasswordEmail } = require("../utils/forgotPasswordEmail");
const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(500).json({ message: "User Already Exists !!" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const userCreated = await User.create({
      username,
      email,
      password: hashPassword,
    });
    res.status(201).json({
      message: userCreated,
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const user = await bcrypt.compare(password, userExist.password);
    if (user) {
      return res.status(200).json({
        message: "Logged In Successfully !",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
        role: userExist.role,
      });
    }
    res.status(400).json({ message: "Invalid Credentials !" });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};
const user = async (req, res) => {
  try {
    const userData = req.user;
    // console.log(req.user)
    res.status(200).json({ message: userData });
  } catch (err) {
    res.status(500).send(err);
  }
};
//***************************************************** */
//      Forgot Password
//***************************************************** */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  const resetUrl = `https://k2taj.co.uk/reset-password/${token}`;
  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p style="color: #555; font-size: 16px;">We received a request to reset your password. Click the button below to set a new password.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #007BFF; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #999; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #aaa; font-size: 12px;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
    </div>
  </div>
`;
  await forgotPasswordEmail(user.email, "Reset Password", html);
  res.json({ message: "Reset email sent" });
};
//***************************************************** */
//      Reset Password
//***************************************************** */
const resetPassword = async (req, res) => {
  try {
  //  console.log("Received token:", req.params.token);
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { Register, Login, user, forgotPassword, resetPassword };

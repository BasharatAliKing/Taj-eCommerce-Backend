const express = require("express");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
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
const user=async(req,res)=>{
    try{
        const userData=req.user;
       // console.log(req.user)
          res.status(200).json({message:userData});
       
    }catch(err){
        res.status(500).send(err);
    }
}
module.exports = { Register, Login, user };

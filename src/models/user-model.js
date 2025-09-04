require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// user Schema here
const registerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});
// token creaated herer
registerSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        role: this.role,
      },
      process.env.SECRET_TOKEN_URL,
      {
        expiresIn: "1d",
      }
    );
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

// user model here
const User = new mongoose.model("User", registerSchema);
module.exports = User;

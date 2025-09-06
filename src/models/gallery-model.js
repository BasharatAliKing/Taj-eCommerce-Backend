const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, // store file path or URL
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);

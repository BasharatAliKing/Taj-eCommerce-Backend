const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  imageUrl: String,
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("FoodItem", foodItemSchema);

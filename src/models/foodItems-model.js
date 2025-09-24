const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: {
    type: Number,
    default: 0,
  },
  size:String,
  description: String,
  imageUrl: String,
  available: {
    type: Boolean,
    default: true,
  },
  suggestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem", // reference to other food items
    },
  ],
});

// ✅ Make suggestions optional with default empty array
foodItemSchema.path("suggestions").default([]);

// ✅ Clean invalid suggestion values before saving
foodItemSchema.pre("validate", function (next) {
  if (Array.isArray(this.suggestions)) {
    this.suggestions = this.suggestions.filter(
      (id) => id && id.toString().trim() !== ""
    );
  }
  next();
});

module.exports = mongoose.model("FoodItem", foodItemSchema);

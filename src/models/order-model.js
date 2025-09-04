// src/models/order-model.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postcode: { type: String, required: true },
      phone: { type: String }
    },
    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
        name: String,
        category: String,
        description: String,
        imageUrl: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);

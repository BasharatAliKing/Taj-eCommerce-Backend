const Order = require('../models/order-model');
const sendEmail = require('../utils/sendEmail');
const { orderConfirmationTemplate, orderNotificationTemplate } = require('../utils/emailTemplates');
const packedOrderEmail = require('../utils/packedOrder');
//**************************************************** */
//        CREATE ORDER
//**************************************************** */
const createOrder = async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;
    if (!user || !items || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newOrder = await Order.create({ user, items, totalAmount });
    // Customer email
    const customerHtml = orderConfirmationTemplate(user, newOrder);
    await sendEmail(user.email, "Your Order is Confirmed 🎉", customerHtml);
    // Admin email
    const adminHtml = orderNotificationTemplate(user, newOrder);
    await sendEmail(process.env.ADMIN_EMAIL, "New Order Received 🛒", adminHtml);
    res.status(201).json({
      message: "Order Created Successfully & Emails Sent",
      order: newOrder,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};
// Update order status & notify customer
const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    // find order
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // update status
    order.status = "confirmed";
    await order.save();

    // send email
    await packedOrderEmail(order, "confirmed");

    res.status(200).json({ message: "Order confirmed & email sent", order });
  } catch (err) {
    console.error("Confirm Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};
//**************************************************** */
//        GET ALL ORDERS
//**************************************************** */
const getAllOrders = async (req, res) => {
  try {
    const getOrders = await Order.find().sort({ createdAt: -1 }); // 👈 newest first;
    res.status(200).json({ orders: getOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//**************************************************** */
//        GET ONE ORDER BY ID
//**************************************************** */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//**************************************************** */
//        UPDATE ORDER
//**************************************************** */
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true, // return updated doc
      runValidators: true, // validate fields
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//**************************************************** */
//        DELETE ORDER
//**************************************************** */
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  confirmOrder
};

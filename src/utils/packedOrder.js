require("dotenv").config();
const nodemailer = require("nodemailer");

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Send customer email when order confirmed
const packedOrderEmail = async (order, type = "confirmed") => {
  const subject =
    type === "confirmed"
      ? "🎉 Your Order is Confirmed - K2-TAJ"
      : "Update on Your Order - K2-TAJ";

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
    <div style="max-width: 700px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #2c3e50; color: #fff; text-align: center; padding: 20px;">
        <img src="https://your-domain.com/k2-taj-logo.png" alt="K2-TAJ" style="height: 60px; margin-bottom: 10px;"/>
        <h2 style="margin: 0;">Order ${order.status}</h2>
      </div>

      <!-- Content -->
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hello <b>${order.user?.firstName || "Customer"}</b>,</p>
        <p>Your order <b>${order._id}</b> has been <span style="color: green; font-weight: bold;">${order.status}</span>.</p>

        <h3 style="margin-top: 20px; color: #2c3e50;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background: #f4f4f4; text-align: left;">
              <th style="padding: 10px; border: 1px solid #ddd;">Image</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; text-align:center;">
                  <img src="http://localhost:3000/${item.imageUrl}" alt="${item.name}" width="60" style="border-radius: 5px;"/>
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">£${item.price.toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">£${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <h3 style="text-align: right; margin-top: 20px; color: #2c3e50;">
          Total: £${order.totalAmount.toFixed(2)}
        </h3>
        <p style="margin-top: 20px;">Status: <b style="color: green; text-transform:capitalize">${order.status}</b></p>
        <p style="margin-top: 10px;">We will notify you when your order is shipped 🚚</p>
      </div>

      <!-- Footer -->
      <div style="background: #f4f4f4; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} K2-TAJ. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"K2-TAJ" <${process.env.NO_REPLY_EMAIL}>`,
    to: order.user.email,
    subject,
    html,
  });
};

module.exports = packedOrderEmail;

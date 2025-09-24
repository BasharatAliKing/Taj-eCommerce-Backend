require("dotenv").config();
const nodemailer = require("nodemailer");

const BASE_URL =  "https://k2taj.co.uk";

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Send customer email when order confirmed/updated
const packedOrderEmail = async (order, type = "confirmed") => {
  const subject =
    type === "confirmed"
      ? "🎉 Your Order is Confirmed - K2-TAJ"
      : "Update on Your Order - K2-TAJ";

  // ✅ check if any product has size
  const hasSize = order.items.some((item) => item.size);

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
      .container { max-width: 700px; margin: 20px auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; }
      .header { background: #2c3e50; color: #fff; text-align: center; padding: 20px; }
      .header img { height: 60px; margin-bottom: 10px; }
      .header h2 { margin: 0; font-size: 22px; }
      .content { padding: 20px; color: #333; }
      .content h3 { margin-top: 20px; color: #2c3e50; }
      .table-container { margin-top: 15px; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 500px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 14px; }
      th { background: #f5b301; color: #221b4b; }
      td img { width: 70px; height: 70px; object-fit: cover; border-radius: 6px; }
      .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 20px; color: #2c3e50; }
      .footer { background: #f4f4f4; text-align: center; padding: 15px; font-size: 13px; color: #777; }

      /* ✅ Responsive */
      @media (max-width: 600px) {
        .container { margin: 10px; width: auto; }
        table, thead, tbody, th, td, tr { display: block; width: 100%; }
        thead { display: none; }
        tr { margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; padding: 10px; }
        td { border: none; text-align: left; padding: 8px; }
        td img { width: 100%; max-width: 120px; height: auto; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      
      <!-- Header -->
      <div class="header">
        <img src="https://your-domain.com/k2-taj-logo.png" alt="K2-TAJ" />
        <h2>Order ${order.status}</h2>
      </div>

      <!-- Content -->
      <div class="content">
        <p style="font-size: 16px;">Hello <b>${order.user?.firstName || "Customer"}</b>,</p>
        <p>Your order <b>${order._id}</b> has been 
          <span style="color: green; font-weight: bold; text-transform: capitalize;">${order.status}</span>.
        </p>

        <h3>Order Details</h3>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                ${hasSize ? "<th>Size</th>" : ""}
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td><img src="${BASE_URL}/${item.imageUrl}" alt="${item.name}" /></td>
                  <td>${item.name}</td>
                  ${hasSize ? `<td>${item.size || "-"}</td>` : ""}
                  <td>£${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>£${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <p class="total">Total: £${order.totalAmount.toFixed(2)}</p>
        <p style="margin-top: 10px;">We will notify you when your order is shipped 🚚</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} K2-TAJ. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"K2-TAJ" <${process.env.NO_REPLY_EMAIL}>`,
    to: order.user.email,
    subject,
    html,
  });
};

module.exports = packedOrderEmail;

const BASE_URL =  "https://k2taj.co.uk";

// ---------------- Customer Email ----------------
const orderConfirmationTemplate = (user, order) => {
  // check if any item has size
  const hasSize = order.items.some(item => item.size);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Confirmation</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
      .container { max-width: 800px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd; }
      .header { background: #221b4b; color: #fff; padding: 25px; text-align: center; }
      .header h1 { margin: 0; font-size: 22px; }
      .content { padding: 20px; color: #333; }
      .summary { margin: 20px 0; font-size: 15px; }
      .summary p { margin: 4px 0; }
      .table-container { margin-top: 20px; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 500px; }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: center; font-size: 14px; }
      th { background: #f5b301; color: #221b4b; }
      td img { width: 70px; height: 70px; object-fit: cover; border-radius: 6px; }
      .total { font-weight: bold; font-size: 16px; }
      .footer { background: #fafafa; text-align: center; padding: 15px; font-size: 13px; color: #777; }

      /* Responsive */
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
      <div class="header">
        <h1>K2-Taj ✅ Order Confirmation</h1>
        <p>Thank you for shopping with us</p>
      </div>
      <div class="content">
        <p>Hi ${user.firstName} ${user.lastName},</p>
        <p>Your order has been placed successfully. Below are your order details:</p>

        <div class="summary">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                ${hasSize ? "<th>Size</th>" : ""}
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><img src="${BASE_URL}/${item.imageUrl}" alt="${item.name}" /></td>
                  <td>${item.name}</td>
                  ${hasSize ? `<td>${item.size || "-"}</td>` : ""}
                  <td>${item.category}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="summary" style="margin-top: 20px; text-align: right;">
          <p class="total">Total Amount: $${order.totalAmount.toFixed(2)}</p>
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} K2-Taj. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// ---------------- Admin Email ----------------
const orderNotificationTemplate = (user, order) => {
  const hasSize = order.items.some(item => item.size);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Order Notification</title>
    <style>
      body { font-family: Arial, sans-serif; background: #fff; margin: 0; padding: 0; }
      .container { max-width: 800px; margin: 30px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
      .header { background: #f5b301; color: #221b4b; padding: 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 22px; }
      .content { padding: 20px; }
      .table-container { margin-top: 20px; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; min-width: 500px; }
      th, td { border: 1px solid #ddd; padding: 10px; text-align: center; font-size: 13px; }
      th { background: #221b4b; color: #fff; }
      td img { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; }

      /* Responsive */
      @media (max-width: 600px) {
        .container { margin: 10px; width: auto; }
        table, thead, tbody, th, td, tr { display: block; width: 100%; }
        thead { display: none; }
        tr { margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; padding: 10px; }
        td { border: none; text-align: left; padding: 8px; }
        td img { width: 100%; max-width: 100px; height: auto; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🛒 New Order Received</h1>
      </div>
      <div class="content">
        <p><strong>Customer:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
        <p><strong>Phone:</strong> ${user.phone || "N/A"}</p>
        <p><strong>Address:</strong> ${user.address}, ${user.city}, ${user.postcode}</p>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Name</th>
                ${hasSize ? "<th>Size</th>" : ""}
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td><img src="${BASE_URL}/${item.imageUrl}" alt="${item.name}" /></td>
                  <td>${item.name}</td>
                  ${hasSize ? `<td>${item.size || "-"}</td>` : ""}
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <p style="text-align: right; font-weight: bold; margin-top: 20px;">
          Total Amount: $${order.totalAmount.toFixed(2)}
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = { orderConfirmationTemplate, orderNotificationTemplate };

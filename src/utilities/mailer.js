const nodemailer = require("nodemailer");

// Create transporter (use your email provider’s SMTP settings)
const transporter = nodemailer.createTransport({
  host: "smtp.yourdomain.com",  // e.g., smtp.gmail.com for Gmail
  port: 587,
  secure: false, // true if port 465
  auth: {
    user: "noreply@yourdomain.com",  // 👈 no-reply email
    pass: "your-email-password",     // or app-specific password
  },
});

// Send email function
const sendNoReplyEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Shop" <noreply@yourdomain.com>`, // sender address
      to,                                           // receiver
      subject,                                      // subject
      html: htmlContent,                            // body
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = sendNoReplyEmail;

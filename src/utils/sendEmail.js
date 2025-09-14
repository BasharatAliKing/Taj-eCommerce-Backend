require("dotenv").config();
// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use custom SMTP
      auth: { 
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    }); 
    await transporter.sendMail({
      from: `"No Reply - Your Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};
module.exports = sendEmail;
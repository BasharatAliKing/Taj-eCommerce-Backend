require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmailToMultipleUsers = async (emails, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails, // ✅ multiple emails as comma-separated string
    subject,
    html: htmlContent,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmailToMultipleUsers };

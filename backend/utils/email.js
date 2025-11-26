const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harini140804@gmail.com",
    pass: "opfc lqkh ldxq iksx", 
  },
});

// Function to send HTML email
const sendHTMLEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: '"H Store" <harini140804@gmail.com>',
      to,
      subject,
      html: htmlContent,
    });
    console.log("HTML Email sent: " + info.response);
  } catch (err) {
    console.error("Error sending HTML email:", err.message);
    throw err; 
  }
};

module.exports = { sendHTMLEmail };

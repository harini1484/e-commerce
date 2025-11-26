const User = require("../models/User");
const nodemailer = require("nodemailer");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harini140804@gmail.com",       
    pass: "opfc lqkh ldxq iksx"         
  }
});

// SEND OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; 
    await user.save();

    await transporter.sendMail({
      from: "harini140804@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
    });

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    res.json({ error: error.message });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    if (!user.otp || user.otp !== otp)
      return res.json({ error: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.json({ error: "OTP expired" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};

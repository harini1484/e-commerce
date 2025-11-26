const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendHTMLEmail } = require("../utils/email");
const welcomeTemplate = require("../utils/welcomeTemplate");

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();

    await sendHTMLEmail(email, "Welcome to HM Store 🎉", welcomeTemplate(name));

    res.json({
      message: "Registered successfully & welcome email sent ✔",
      user: { name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ error: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// SEND LOGIN OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendHTMLEmail(email, "Your OTP Code", `<p>Your OTP is: <b>${otp}</b></p>`);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// VERIFY LOGIN OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    if (user.otp !== otp.toString()) return res.json({ error: "Invalid OTP" });

    user.otp = "";
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// SEND PAYMENT OTP
const sendPaymentOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.paymentOtp = otp;

    console.log("Saving OTP:", otp, "for email:", email); 

    await user.save();

    await sendHTMLEmail(email, "Your Payment OTP", `<p>Your OTP is: <b>${otp}</b></p>`);

    res.json({ message: "Payment OTP sent successfully" });
  } catch (err) {
    console.error("Error in sendPaymentOtp:", err);
    res.json({ error: err.message });
  }
};

// VERIFY PAYMENT OTP
const verifyPaymentOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "User not found" });

    const otpTrimmed = otp.toString().trim();
    const savedOtp = user.paymentOtp ? user.paymentOtp.trim() : "";

    console.log("Received OTP:", otpTrimmed, "Saved OTP:", savedOtp); 

    if (!savedOtp || otpTrimmed !== savedOtp) {
      return res.json({ error: "Invalid OTP" });
    }

    user.paymentOtp = "";
    await user.save();

    res.json({ message: "Payment verified successfully" });
  } catch (err) {
    console.error("Error in verifyPaymentOtp:", err);
    res.json({ error: err.message });
  }
};

module.exports = { register, login, sendOtp, verifyOtp, sendPaymentOtp, verifyPaymentOtp };

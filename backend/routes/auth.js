const express = require("express");
const router = express.Router();
const {
  register,
  login,
  sendOtp,
  verifyOtp,
  sendPaymentOtp,
  verifyPaymentOtp,
} = require("../controllers/auth");

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp); 
router.post("/send-payment-otp", sendPaymentOtp); 
router.post("/verify-payment-otp", verifyPaymentOtp); 

module.exports = router;

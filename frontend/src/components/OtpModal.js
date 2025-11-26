import React, { useState, useEffect } from "react";
import axios from "axios";

const OtpModal = ({ email, onClose, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); 
  const [message, setMessage] = useState("");
  const [resendAvailable, setResendAvailable] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setResendAvailable(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Format mm:ss
  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Verify OTP
  const handleVerify = async () => {
    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/auth/verify-otp", {
        email,
        otp,
      });
      setMessage("OTP Verified ✔");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid OTP");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      await axios.post("http://localhost:3001/auth/send-otp", { email });
      setMessage("OTP resent to your email");
      setTimer(300);
      setResendAvailable(false);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to resend OTP");
    }
  };

  const popupStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };
  const modalStyle = {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    width: "320px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  };
  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    textAlign: "center",
    fontSize: "16px",
  };
  const btnStyle = {
    padding: "10px 16px",
    margin: "5px",
    border: "none",
    borderRadius: "6px",
    background: "#4a67ff",
    color: "#fff",
    cursor: "pointer",
  };
  const resendBtnStyle = {
    ...btnStyle,
    background: resendAvailable ? "#ff9800" : "#ccc",
    cursor: resendAvailable ? "pointer" : "not-allowed",
  };
  const closeBtnStyle = {
    ...btnStyle,
    background: "#888",
  };

  return (
    <div style={popupStyle}>
      <div style={modalStyle}>
        <h3>Enter OTP</h3>
        <p>OTP sent to: {email}</p>
        <p>
          Time remaining: <b>{formatTime()}</b>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
          style={inputStyle}
        />

        <div>
          <button onClick={handleVerify} style={btnStyle}>
            Verify OTP
          </button>
          <button
            onClick={handleResend}
            style={resendBtnStyle}
            disabled={!resendAvailable}
          >
            Resend OTP
          </button>
        </div>

        <button onClick={onClose} style={closeBtnStyle}>
          Cancel
        </button>

        {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
      </div>
    </div>
  );
};

export default OtpModal;

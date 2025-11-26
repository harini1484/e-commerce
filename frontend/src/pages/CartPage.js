import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";

const CartPage = () => {
  const { cart, removeItem, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [inputOtp, setInputOtp] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [message, setMessage] = useState("");

  // Address / Location States
  const [currentLocation, setCurrentLocation] = useState("");
  const [manualAddress, setManualAddress] = useState({
    building: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [selectedAddress, setSelectedAddress] = useState("");

  const total = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  // Ensure user is logged in
  useEffect(() => {
    if (!user) setMessage("Please login to make a payment");
    else setMessage("");
  }, [user]);

  // Get user's current location
  useEffect(() => {
    if (!currentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const formattedAddress = data.display_name;

            setCurrentLocation(formattedAddress);
            setSelectedAddress(formattedAddress);
          } catch (err) {
            console.error("Error reverse geocoding:", err);
            setCurrentLocation(`${latitude}, ${longitude}`);
            setSelectedAddress(`${latitude}, ${longitude}`);
          }
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, [currentLocation]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    await updateQuantity(productId, quantity);
  };

  const sendOtp = async () => {
    if (!user?.email) return alert("Email not found. Please login first!");
    if (!paymentMethod) return alert("Please select a payment method first!");
    if (!selectedAddress) return alert("Please select or enter an address before proceeding!");

    try {
      const res = await fetch("http://localhost:3001/auth/send-payment-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setMessage(data.message || "OTP sent successfully. Check your email.");
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setMessage("Failed to send OTP. Try again.");
    }
  };

  const verifyOtp = async () => {
    if (!user?.email) {
      setMessage("User email not found. Please login again.");
      return;
    }

    const otpTrimmed = inputOtp.trim();

    if (!otpTrimmed) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/verify-payment-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, otp: otpTrimmed }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetch("http://localhost:3001/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: user._id,
    userEmail: user.email,   // optional, for sending email
    items: cart,
    totalAmount: total,
    address: selectedAddress,
    paymentMethod: paymentMethod,
  }),
});

        clearCart();
        setPaymentDone(true);
        setMessage(`Payment successful! Delivered to: ${selectedAddress}`);
      } else {
        setMessage(data.error || "Incorrect OTP. Try again!");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setMessage("OTP verification failed. Try again.");
    }
  };

  // Payment success screen
  if (paymentDone) {
    return (
      <div className="payment-success">
        <div className="payment-success-box">
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase, {user?.name || "valued customer"}! 🎉</p>
          <p>Your order will be delivered to:</p>
          <p>{selectedAddress}</p>
          <p>We appreciate your business and hope you enjoy your purchase!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src="/images/empty-cart.png" alt="Empty Cart" />
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              {item.image && (
                <img src={item.image} alt={item.name} className="cart-item-image" />
              )}

              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">₹{item.price}</p>
                {item.description && (
                  <p className="cart-item-description">{item.description}</p>
                )}

                <div className="cart-item-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) =>
                      handleQuantityChange(item._id, Number(e.target.value))
                    }
                  />
                  <button onClick={() => removeItem(item._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          {/* Address Section */}
          <div className="address-section">
            <h4>Delivery Address</h4>

            {currentLocation && (
              <div className="current-location">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === currentLocation}
                  onChange={() => setSelectedAddress(currentLocation)}
                />
                <label>Use my current location: {currentLocation}</label>
              </div>
            )}

            {/* Manual Address Entry */}
            <div className="manual-address">
              <h5>Enter Address Manually:</h5>

              <div className="address-grid">
                {["building", "street", "area", "landmark", "city", "state", "pincode"].map(
                  (field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={manualAddress[field]}
                      onChange={(e) =>
                        setManualAddress({ ...manualAddress, [field]: e.target.value })
                      }
                    />
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setSelectedAddress(
                    `${manualAddress.building}, ${manualAddress.street}, ${manualAddress.area}, ${manualAddress.city}, ${manualAddress.state} ${manualAddress.pincode}, India`
                  )
                }
              >
                Use This Address
              </button>
            </div>

            {selectedAddress && <p>Selected Address: {selectedAddress}</p>}
          </div>

          {/* Payment Section */}
          {!otpSent ? (
            <div className="payment-method">
              <h4>Select Payment Method:</h4>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Credit/Debit Card"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit/Debit Card
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                UPI
              </label>

              <button className="checkout-btn" onClick={sendOtp}>
                Proceed to Payment
              </button>
            </div>
          ) : (
            <div className="otp-verification">
              <h4>Enter OTP sent to your email</h4>

              <input
                type="text"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
                placeholder="Enter OTP"
              />

              <button onClick={verifyOtp}>Verify OTP & Pay</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;

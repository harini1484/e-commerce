const Order = require("../models/Order");
const { sendHTMLEmail } = require("../utils/email");

const createOrder = async (req, res) => {
  try {
    console.log("Order data received:", req.body);
    const order = await Order.create(req.body);
    console.log("Order created:", order._id);

    if (order.userEmail) {
  console.log("Sending email to:", order.userEmail);
  try {
    await sendHTMLEmail(
      order.userEmail,
      "Order Confirmation",
      `<h1>Thank you for your order!</h1>
      <p>Order ID: ${order._id}</p>
      <p>Total: ₹${order.totalAmount}</p>
      <p>Delivery Address: ${order.address}</p>
      <h3>Items:</h3>
      <ul>
        ${order.items.map(
          (item) =>
            `<li>${item.quantity || 1} × ${item.name} (₹${item.price})</li>`
        ).join("")}
      </ul>`
    );
    console.log("Email sent successfully ✅");
  } catch (emailErr) {
    console.error("Email sending failed:", emailErr.message);
  }
}
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Order creation failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
};

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected");
});

const app = express();
app.use(bodyParser.json());
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000",
}));

// Routes
app.use("/products", productRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(3001, () => console.log("Server running on 3001"));

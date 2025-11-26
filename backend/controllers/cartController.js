const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const qty = Number(quantity);

    if (isNaN(qty) || qty < 1) {
      return res.json({ error: "Quantity must be a positive number" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: qty }],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += qty;
      } else {
        cart.products.push({ productId, quantity: qty });
      }
    }

    await cart.save();

    const populatedCart = await cart.populate("products.productId", "name price image");
    res.json(populatedCart);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "products.productId",
      "name price image"
    );

    if (!cart) return res.json({ products: [] });
    res.json(cart);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({ products: [] });
    }

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );

    await cart.save();
    const populatedCart = await cart.populate("products.productId", "name price image");
    res.json(populatedCart);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// UPDATE QUANTITY
const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const qty = Number(quantity);

    if (isNaN(qty) || qty < 1) {
      return res.json({ error: "Quantity must be a positive number" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity: qty }] });
      await cart.save();
      const populatedCart = await cart.populate("products.productId", "name price image");
      return res.json(populatedCart);
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      cart.products.push({ productId, quantity: qty });
    } else {
      cart.products[productIndex].quantity = qty;
    }

    await cart.save();
    const populatedCart = await cart.populate("products.productId", "name price image");
    res.json(populatedCart);
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
};

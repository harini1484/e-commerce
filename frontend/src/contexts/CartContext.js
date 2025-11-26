import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    if (!product || !product._id) return;

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const updateQuantity = async (id, quantity) => {
    try {
      const userId =
        user?._id || JSON.parse(localStorage.getItem("user"))?._id;

      if (!userId) throw new Error("You must be logged in to update cart");

      const res = await axios.put("http://localhost:3001/cart/update-quantity", {
        userId,
        productId: id,
        quantity,
      });

      setCart(
        res.data.products.map((p) => ({
          _id: p.productId._id,
          name: p.productId.name,
          price: p.productId.price,
          image: p.productId.image,
          quantity: p.quantity,
        }))
      );
    } catch (err) {
      console.error("Failed to update quantity", err);
      alert(err.response?.data?.error || err.message);
    }
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

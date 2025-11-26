import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { addToCart, fetchProductById } from "../api/axios";
import { CartContext } from "../contexts/CartContext";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetchProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    loadProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="container">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="product-page container">
      <div className="product-grid-detail">
        <div className="left">
          {product.image && (
            <img src={product.image} alt={product.name} />
          )}
        </div>

        <div className="right">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>
          <p>{product.description}</p>

          <div className="product-actions">
            <button className="btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>

          <div className="shipping">
  <p>
    <strong>Delivery 🚚</strong> — Free over ₹999 | Expected by Tomorrow / Day After Tomorrow
  </p>
</div>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;

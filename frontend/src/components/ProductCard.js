import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="thumb">
          <img
            src={product.image || "/images/product-default.jpg"}
            alt={product.name || "Product"}
          />
        </div>
        <div className="info">
          <h3>{product.name || "Unnamed Product"}</h3>
          <p className="price">₹{product.price ?? "N/A"}</p>
          <p className="desc">
            {product.description ? product.description.slice(0, 80) + "..." : "No description"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

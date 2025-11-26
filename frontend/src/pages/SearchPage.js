import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const [filtered, setFiltered] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:3001/products");
      const data = await res.json();
      setAllProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }

    const words = query.split(" ").filter(Boolean);

    const knownCategories = [
      "laptop", "phone", "tablet", "camera", "tv", "watch", "accessory"
    ];

    let category = "";
    let minPrice = null;

    words.forEach((word) => {
      if (knownCategories.includes(word)) category = word;

      if (word === "above") {
        const value = parseInt(query.replace(/\D/g, ""));
        if (!isNaN(value)) minPrice = value;
      }
    });

    const keywordWords = words.filter(
      (w) => w !== "above" && w !== category && isNaN(parseInt(w))
    );

    const results = allProducts.filter((p) => {
      const text = `${p.name} ${p.category} ${p.description}`.toLowerCase();

      const matchesKeywords = keywordWords.every((kw) => text.includes(kw));
      const matchesCategory =
        category ? p.category.toLowerCase().includes(category) : true;
      const matchesPrice =
        minPrice !== null ? p.price >= minPrice : true;

      return matchesKeywords && matchesCategory && matchesPrice;
    });

    setFiltered(results);
  }, [query, allProducts]);

  return (
    <div className="container search-results">
      <h2>Search Results for: <b>{query}</b></h2>

      {filtered.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={product.image || "/images/product-default.jpg"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <p>{product.category}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;

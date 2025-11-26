import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products for suggestions
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
      setSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allProducts.filter((p) =>
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(lowerQuery)
    );

    setSuggestions(filtered.slice(0, 5)); 
  }, [query, allProducts]);

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSuggestions([]);
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="site-header">
      <div className="header-top container">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.jpg" alt="Electronics Logo" />
          </Link>
        </div>

        <div className="search-bar" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search phones, laptops, accessories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleEnterPress}
          />
          <button onClick={handleSearch}>Search</button>

          {suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map((s) => (
                <div
                  key={s._id}
                  className="suggestion-item"
                  onClick={() => {
                    navigate(`/product/${s._id}`);
                    setQuery("");
                    setSuggestions([]);
                  }}
                >
                  <img
                    src={s.image || "/images/product-default.jpg"}
                    alt={s.name}
                    className="suggestion-img"
                  />
                  <div className="suggestion-text">
                    <span className="name">{s.name}</span>
                    <span className="category">{s.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-links">
          <Link to="/">Home</Link>
          <Link to="/cart">🛒Cart({cart.length})</Link>

          {user ? (
            <>
              <span className="welcome">👤 Welcome, {user.name}</span>
              <button className="btn-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-signup">Login</Link>
              <Link to="/register" className="btn-signup">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

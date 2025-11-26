import React, { useEffect, useState, useContext } from "react";
import Hero from "../components/Hero";
import CategoryList from "../components/CategoryList";
import Footer from "../components/Footer";
import { fetchProducts } from "../api/axios";
import { useLocation, Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const useQuery = () => new URLSearchParams(useLocation().search);

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const q = useQuery();
  const search = q.get("q") || "";
  const category = q.get("category") || "";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        let list = res.data || [];

        if (category) {
          list = list.filter((p) => p.category === category);
        }

        if (search) {
          const s = search.toLowerCase();
          list = list.filter((p) =>
            (p.name + " " + (p.description || "")).toLowerCase().includes(s)
          );
        }

        setProducts(list);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    loadProducts();
  }, [search, category]);

  return (
    <main>
      <Hero />
      <div className="container">
        <CategoryList />

        <section id="featured" className="featured">
          <h2>Featured picks</h2>
          <div className="featured-grid">
            <img src="/images/featured-1.jpg" alt="Featured 1" />
            <img src="/images/featured-2.jpg" alt="Featured 2" />
            <img src="/images/featured-3.jpg" alt="Featured 3" />
          </div>
        </section>

        <section className="product-grid-wrap">
          <h2>All Products</h2>

          <div className="product-grid">
            {products.map((p) => (
              <div key={p._id} className="product-card">

                {/* Product Click Link */}
                <Link to={`/product/${p._id}`} className="product-link">
                  <div className="thumb">
                    {p.image && <img src={p.image} alt={p.name} />}
                  </div>

                  <div className="info">
                    <h3>{p.name}</h3>
                    <p className="desc">{p.description}</p>
                    <p className="price">₹{p.price}</p>
                  </div>
                </Link>

                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
              </div>
            ))}

            {products.length === 0 && (
              <p className="muted">No products found.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default Home;

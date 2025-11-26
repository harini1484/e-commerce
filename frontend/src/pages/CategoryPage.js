import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/axios";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        
        const filtered = res.data.filter(p => p.category === categoryName);
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };
    loadProducts();
  }, [categoryName]);

  return (
     <main className="container category-page">
      <h2>Category: {categoryName}</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map(p => <ProductCard key={p._id} product={p} />)
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default CategoryPage;

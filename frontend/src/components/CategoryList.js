import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "Phones", name: "Phones", img: "/images/category-phones.jpg" },
  { id: "Laptops", name: "Laptops", img: "/images/category-laptops.jpg" },
  { id: "TV", name: "TV", img: "/images/category-tv.jpg" },
  { id: "Household Appliances", name: "Household Appliances", img: "/images/category-accessories.jpg" }
];

const CategoryList = () => (
  <section id="categories" className="categories">
    <h2>Shop by category</h2>
    <div className="cats-grid">
      {categories.map(c => (
        <Link key={c.id} to={`/category/${c.id}`} className="cat-card">
          <img src={c.img} alt={c.name} />
          <div className="cat-name">{c.name}</div>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoryList;

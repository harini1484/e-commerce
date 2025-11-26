import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001",
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Products
export const fetchProducts = () => API.get("/products");
export const fetchProductById = (id) => API.get(`/products/${id}`);

// Cart
export const addToCart = ({ userId, productId, quantity }) =>
  API.post("/cart/add", { userId, productId, quantity });

export default API;

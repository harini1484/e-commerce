import React, { createContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const register = async (data, setMessage) => {
    try {
      const res = await registerUser(data);
      setMessage(res.data.message || "Registration successful!");
  
      const minimalUser = {
        _id: res.data.user._id, 
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone
      };
      localStorage.setItem("user", JSON.stringify(minimalUser));

      setTimeout(() => navigate("/login"), 1400);
      return res.data;
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  const login = async (data, setMessage) => {
    try {
      const res = await loginUser(data);
      const returnedUser = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone
      };
      setUser(returnedUser);
      localStorage.setItem("user", JSON.stringify(returnedUser));

      setMessage(res.data.message || "Login successful!");
      setTimeout(() => navigate("/"), 1000);
      return res.data;
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };

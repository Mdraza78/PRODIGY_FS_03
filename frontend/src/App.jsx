import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard"; // Optional
import Cart from "./Components/Cart";
import Register from "./Components/Register";
import Payment from "./Components/Payment";
import Order from "./Components/Order";
import MyOrder from "./Components/MyOrder";
import Home from "./Components/Home";
import axios from "axios";

function App() {
  const [cart, setCart] = useState(() => {
    // Initialize from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Helper to update cart and persist for guests
  const updateCart = (newCart) => {
    setCart(newCart);
  };

  // Optional: Function to merge localStorage cart with server cart after login
  const mergeCartAfterLogin = async (token) => {
    if (localStorage.getItem('cart')) {
      try {
        await axios.put('/api/cart/merge', JSON.parse(localStorage.getItem('cart')), {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('cart');
        // Optionally fetch updated cart from server
        const { data } = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(data);
      } catch (err) {
        console.error('Cart merge error:', err);
      }
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login updateCart={updateCart} mergeCartAfterLogin={mergeCartAfterLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/dashboard" element={<Dashboard cart={cart} setCart={updateCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={updateCart} />} />
        <Route path="/order-placed" element={<Order/>}/>
        <Route path="/myorder" element={<MyOrder/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;

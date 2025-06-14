import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("savedAddress");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          address: "",
          locality: "",
          landmark: "",
          city: "",
          state: "",
          pincode: "",
          phone: "",
          altPhone: "",
        };
  });
  const [savedAddress, setSavedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const deliveryCharge = totalAmount < 500 ? 50 : 0;
  const finalTotal = totalAmount + deliveryCharge;

  const saveOrderToHistory = () => {
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cart],
      address: {...savedAddress},
      total: finalTotal,
      deliveryCharge: deliveryCharge,
      status: "Placed",
      customerName: savedAddress.name,
      customerPhone: savedAddress.phone,
      customerAddress: `${savedAddress.address}, ${savedAddress.locality}, ${savedAddress.city}, ${savedAddress.state} - ${savedAddress.pincode}`
    };
    orderHistory.unshift(newOrder);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedAddress(formData);
    setIsEditing(false);
    localStorage.setItem("savedAddress", JSON.stringify(formData));
  };

  const handleRemove = () => {
    setSavedAddress(null);
    setFormData({
      name: "",
      address: "",
      locality: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      altPhone: "",
    });
    setIsEditing(true);
    localStorage.removeItem("savedAddress");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedAddress");
    if (saved) {
      setSavedAddress(JSON.parse(saved));
      setIsEditing(false);
    }
  }, []);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = () => {
    saveOrderToHistory();
    localStorage.removeItem("cart");
    navigate('/order-placed');
  };

  return (
    <>
      <nav className="navbar-cart">
        <h1 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          Ratna Supermarket
        </h1>
      </nav>
      <div className="payment-page-main">
        <div className="payment-left">
          <div className="payment-card">
            {!savedAddress || isEditing ? (
              <form onSubmit={handleSubmit} className="payment-form">
                <h2 style={{ color: "#444", marginBottom: 12, fontWeight: 500, letterSpacing: 0.5 }}>
                  ADDRESS
                </h2>
                <div className="input-outline-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-outline"
                    required
                  />
                  <label htmlFor="name">
                    Name <span style={{ color: "#e53935" }}>*</span>
                  </label>
                </div>
                <div className="input-outline-group">
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-outline"
                    required
                    rows="2"
                  />
                  <label htmlFor="address">
                    Address (House no, Building no, Street Area){" "}
                    <span style={{ color: "#e53935" }}>*</span>
                  </label>
                </div>
                <div className="input-outline-group">
                  <input
                    type="text"
                    id="locality"
                    name="locality"
                    value={formData.locality}
                    onChange={handleChange}
                    className="input-outline"
                    required
                  />
                  <label htmlFor="locality">
                    Locality/Town <span style={{ color: "#e53935" }}>*</span>
                  </label>
                </div>
                <div className="input-outline-group">
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="input-outline"
                  />
                  <label htmlFor="landmark">Landmark</label>
                </div>
                <div className="input-outline-group">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-outline"
                    required
                  />
                  <label htmlFor="city">
                    City <span style={{ color: "#e53935" }}>*</span>
                  </label>
                </div>
                <div className="input-outline-group">
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input-outline"
                    required
                  />
                  <label htmlFor="state">
                    State <span style={{ color: "#e53935" }}>*</span>
                  </label>
                </div>
                <div className="input-outline-group">
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="input-outline"
                    required
                  />
                  <label htmlFor="pincode">
                    Pincode <span style={{ color: "#e53935" }}>*</span>
                  </label>
                </div>
                <div className="input-outline-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-outline"
                    required
                  />
                  <label htmlFor="phone">
                    Phone Number <span style={{ color: "#e53935" }}>*</span>
                  </label>
                </div>
                <div className="input-outline-group">
                  <input
                    type="tel"
                    id="altPhone"
                    name="altPhone"
                    value={formData.altPhone}
                    onChange={handleChange}
                    className="input-outline"
                  />
                  <label htmlFor="altPhone">
                    Alternative Phone Number (optional)
                  </label>
                </div>
                <button type="submit" className="continue-btn">
                  Save Details
                </button>
              </form>
            ) : (
              <div>
                <h1 style={{ fontWeight: "100" }}>Delivery Address</h1>
                <br />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: "#2c3e50", fontWeight: 100, fontSize: 18, display: "flex", alignItems: "center" }}>
                    <svg width="20" height="20" style={{ marginRight: 6, verticalAlign: "middle" }} fill="#2c3e50" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8" fill="#fff" stroke="#2c3e50" strokeWidth="2" />
                      <circle cx="12" cy="12" r="5" fill="#2c3e50" />
                    </svg>
                    {savedAddress.name}
                  </span>
                  <span style={{ borderRadius: 8, background: "#e9f8f3", color: "#03a685", fontWeight: 200, fontSize: 12, padding: "2px 10px" }}>
                    HOME
                  </span>
                </div>
                <br />
                <div style={{ color: "gray", margin: "8px 0" }}>
                  {savedAddress.address}, {savedAddress.locality}
                  {savedAddress.landmark && `, ${savedAddress.landmark}`}
                  <br />
                  {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
                </div>
                <div style={{ margin: "6px 0", color: "gray" }}>
                  Mobile: <b style={{ fontWeight: 300, color: "gray" }}>{savedAddress.phone}</b>
                  {savedAddress.altPhone && (
                    <span>, Alt: <b style={{ fontWeight: 300, color: "gray" }}>{savedAddress.altPhone}</b></span>
                  )}
                </div>
                <br />
                <div style={{ color: "grey", fontSize: 15, marginBottom: 8 }}>
                  • Pay on Delivery available
                </div>
                <br />
                <div style={{ display: "flex", gap: 14 }}>
                  <button type="button" className="address-btn" onClick={handleRemove}>
                    REMOVE
                  </button>
                  <button type="button" className="address-btn" onClick={handleEdit}>
                    EDIT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="payment-summary">
          <div className="payment-card">
            <h1 className="summary-title">Order Items</h1>
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-image-container">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <div className="cart-item-meta">Qty: {item.quantity || 1}</div>
                  </div>
                </div>
              ))}
            </div>
           
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="price-row">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <br />
            <hr />
            <div className="payment-cards" style={{ marginTop: '24px' }}>
              <h2 className="payment-title">Select Payment Method</h2>
              
              <div className="payment-methods-container">
                <div className="payment-method-option">
                  <label className="payment-radio-label">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={handlePaymentChange}
                      className="payment-radio-custom"
                    />
                    <div className="payment-method-details">
                      <span className="payment-radio-text">Cash on Delivery (Cash/UPI)</span>
                      <div className="payment-method-description">
                        Pay via cash or UPI when your order arrives
                      </div>
                    </div>
                  </label>
                  <div className="payment-radio-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#2c3e50">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {paymentMethod && (
                <button className="place-order-btn" onClick={handlePlaceOrder}>
                  PLACE ORDER
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
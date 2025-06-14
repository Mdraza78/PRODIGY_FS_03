// OrderSummary.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSummary.css';

const OrderSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;

  if (!product) {
    return (
      <div className="order-not-found">
        <h1>Order Not Found</h1>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="order-summary-container">
      <div className="delivery-card">
        <div className="delivery-header">
          <span className="delivery-status">Delivered</span>
          <span className="delivery-date">On Tue, 29 Apr</span>
        </div>
        
        <div className="delivery-item">
          <div className="item-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="item-details">
            <h3 className="item-name">{product.name}</h3>
            <p className="item-size">Size: {product.size || 'XL'}</p>
            <p className="return-window">
              ● Exchange/Return window closed on Sun, 30 Mar
            </p>
          </div>
        </div>
        
        <div className="rating-section">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star">★</span>
            ))}
          </div>
          <p className="rating-text">Rate & Review to earn <strong>Myntra Credit</strong></p>
        </div>
      </div>

      <div className="order-details-card">
        <h2>Order Summary</h2>
        <div className="order-details-section">
          <h3>Order Items</h3>
          <ul>
            <li className="order-item">
              <span>{product.name}</span>
              <span>Qty: {product.quantity || 1}</span>
              <span>₹{product.price * (product.quantity || 1)}</span>
            </li>
          </ul>
        </div>

        <div className="order-details-section">
          <h3>Total Amount</h3>
          <p>₹{(product.price * (product.quantity || 1)).toFixed(2)}</p>
        </div>
      </div>

      <button className="home-button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default OrderSummary;
import React from "react";
import axios from "axios";
import "./Cart.css";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  // Quantity handlers
  const handleIncrease = async (id) => {
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCart(newCart);
    await updateCartOnServer(newCart);
  };

   const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }
    navigate('/payment', { 
      state: { 
        cartItems: cart,
        totalAmount: totalAmount,
        totalItems: totalItems
      } 
    });
  };

  const handleDecrease = async (id) => {
    const newCart = cart.map(item =>
      item.id === id && (item.quantity || 1) > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => (item.quantity || 1) > 0);
    setCart(newCart);
    await updateCartOnServer(newCart);
  };

  const handleRemove = async (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    await updateCartOnServer(newCart);
  };

  const updateCartOnServer = async (updatedCart) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/cart', updatedCart, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  // Price calculations
  const totalMRP = cart.reduce((sum, item) => 
    sum + (item.originalPrice ? item.originalPrice * (item.quantity || 1) : item.price * (item.quantity || 1)), 
  0);
  
  const totalPrice = cart.reduce((sum, item) => 
    sum + item.price * (item.quantity || 1), 
  0);
  
  const totalDiscount = totalMRP - totalPrice;
const freeShippingThreshold = 500;
const shippingFee = totalPrice >= freeShippingThreshold ? 0 : 50; // Changed from totalMRP to totalPrice
const totalAmount = totalPrice + shippingFee;

// Calculate how much more needed for free shipping based on Total Price
const amountNeededForFreeShipping = Math.max(freeShippingThreshold - totalPrice, 0); // Changed from totalMRP to totalPrice
const showFreeShippingMessage = totalPrice > 0 && totalPrice < freeShippingThreshold; // Changed from totalMRP to totalPrice


  const handlePlaceOrder = () => {
    alert(`Order placed! Total Amount: ₹${totalAmount.toFixed(2)}`);
    // Optionally clear cart after order placement
    // setCart([]);
  };

  // Get total items count
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      <nav className="navbar-cart">
        <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Ratna Supermarket</h1>
     
      </nav>

      <div className="cart-container">
        <div className="cart-items-section">
          <h2 className="cart-title">Shopping Cart</h2>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <img src="https://static.vecteezy.com/system/resources/previews/005/006/007/non_2x/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg" alt="..." />
               <p>Your Cart is Empty</p>
              
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate('/dashboard')}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-image-container">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="cart-item-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.name}</h2>
                    <div className="cart-item-meta">
                      <span className="cart-item-size">Size: {item.size || "Default"}</span>
                      <div className="cart-item-quantity">
                        <span className="quantity-label">Qty:</span>
                        <button
                          className="quantity-btn decrease"
                          onClick={() => handleDecrease(item.id)}
                          disabled={(item.quantity || 1) === 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.quantity || 1}</span>
                        <button
                          className="quantity-btn increase"
                          onClick={() => handleIncrease(item.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-pricing">
                      <span className="current-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                      {item.originalPrice && (
                        <>
                          <span className="original-price">₹{(item.originalPrice * (item.quantity || 1)).toFixed(2)}</span>
                          <span className="discount-badge">
                            {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <div className="delivery-info">
                      Delivery within <span className="delivery-date">10am - 8pm (Today)</span>
                    </div>
                  </div>
                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                  
                </div>
                
              ))}
            </div>
            
          )}
        </div>

        {cart.length > 0 && (
          <div className="order-summary">
            <h3 className="summary-title">
              PRICE DETAILS ({totalItems} Items)
            </h3>
            <br />
            <div className="price-row">
              <span>Total MRP</span>
              <span>₹{totalMRP.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>
                Discount on MRP <button className="info-link">Know More</button>
              </span>
              <span className="discount-amount">-₹{totalDiscount.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>
                Shipping Fee <button className="info-link">Know More</button>
              </span>
              <span className={`shipping-fee ${shippingFee === 0 ? "free" : ""}`}>
                {shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}
              </span>
            </div>
            
            {/* Shipping messages */}
            {shippingFee === 0 ? (
              <div className="free-shipping-message">
                <span className="free-shipping-badge">FREE SHIPPING</span>
                <span>on orders above ₹{freeShippingThreshold}</span>
              </div>
            ) : (
              <div className="add-more-message">
                Add ₹{amountNeededForFreeShipping.toFixed(2)} more to get FREE shipping!
              </div>
            )}
            
            <div className="divider"></div>
            <div className="total-row">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            
              <button 
            className="place-order-btn"
            onClick={handleCheckout}
            aria-label="Place order"
          >
            CHECKOUT
          </button>
          </div>
        )}
      </div>
    </>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaUser, FaChevronLeft, FaPhoneAlt, FaChevronRight, FaChevronLeft as FaChevronLeftIcon } from "react-icons/fa";
import "./myorder.css";
import Nav from "./Nav";

export default function MyOrder() {
  const navigate = useNavigate();
  const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
  const savedAddress = localStorage.getItem("savedAddress");
  const address = savedAddress ? JSON.parse(savedAddress) : null;
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;

  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
  const mostRecentOrder = orderHistory.length > 0 ? orderHistory[0] : null;

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderHistory.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orderHistory.length / ordersPerPage);

  const currentTotal = currentCart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const currentDeliveryCharge = currentTotal < 500 ? 50 : 0;
  const currentFinalTotal = currentTotal + currentDeliveryCharge;

  if (currentCart.length === 0 && orderHistory.length === 0) {
    return (
      <div className="no-orders">
        <p>You have no orders yet.</p>
        <button 
          className="action-button" 
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (selectedOrderId) {
    const selectedOrder = orderHistory.find(order => order.id === selectedOrderId);
    if (!selectedOrder) {
      setSelectedOrderId(null);
      return null;
    }
    const addr = selectedOrder.address || {};
    return (
      <>
         <nav className="navbar-cart">
        <h1 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          Ratna Supermarket
        </h1>
      </nav>
        <div className="my-orders-container">
          <button 
            className="back-button"
            onClick={() => setSelectedOrderId(null)}
          >
            <FaChevronLeft /> Back to Orders
          </button>
          <div className="order-summary-flex">
            <div className="order-summary-left">
              {selectedOrder.items.map((item, idx) => (
                <div className="order-product-row" key={idx}>
                  <div className="order-product-img-wrap">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="order-product-img"
                    />
                  </div>
                  <div className="order-product-info">
                    <div className="order-product-name">{item.name}</div>
                    <div className="order-product-qty">Qty: {item.quantity || 1}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary-right">
              <div className="order-summary-card">
                <div className="order-summary-section">
                  <div className="order-summary-section-title">Delivery details</div>
                  <div className="order-summary-address">
                    <div className="order-summary-address-line">
                      <FaMapMarkerAlt className="address-icon" />
                      {addr.address || 'Not provided'}, {addr.locality || ''}
                      {addr.landmark && `, ${addr.landmark}`}
                    </div>
                    <div className="order-summary-address-line">
                      <span className="icon-spacer"></span>
                      {addr.city || ''}, {addr.state || ''} - {addr.pincode || ''}
                    </div>
                    <div className="order-summary-address-line">
                      <FaUser className="address-icon" />
                      <strong>{addr.name || 'Not provided'}</strong>
                    </div>
                    <div className="order-summary-address-line">
                      <FaPhoneAlt className="address-icon" />
                      <strong>Phone:</strong> {addr.phone || ''}
                    </div>
                    {addr.altPhone && (
                      <div className="order-summary-address-line">
                        <FaPhoneAlt className="address-icon" />
                        <strong>Alt Phone:</strong> {addr.altPhone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="order-summary-card">
                <div className="order-summary-section">
                  <div className="order-summary-section-title">Price details</div>
                  <div className="order-summary-price-row">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  {selectedOrder.deliveryCharge > 0 && (
                    <div className="order-summary-price-row">
                      <span>Delivery Charge</span>
                      <span>₹{selectedOrder.deliveryCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="order-summary-price-row total-row">
                    <span>Total Amount</span>
                    <span>₹{(selectedOrder.total + selectedOrder.deliveryCharge).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
       <nav className="navbar-cart">
        <h1 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          Ratna Supermarket
        </h1>
      </nav>
      <div className="my-orders-container">
        <h1>My Orders</h1>

        <div className="order-tabs">
          <button
            className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('current');
              setCurrentPage(1);
            }}
          >
            Current Order
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Order History
          </button>
        </div>

        {activeTab === 'current' ? (
          <>
            {currentCart.length > 0 ? (
              <>
                {!showSummary ? (
                  <div className="cart-preview" onClick={() => setShowSummary(true)}>
                    {currentCart.slice(0, 1).map((item, index) => (
                      <div key={index} className="cart-item">
                        <div className="cart-image-container">
                          <img
                            src={item.image || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="cart-item-image"
                          />
                        </div>
                        <div className="cart-item-details">
                          <h4 className="cart-item-name">{item.name}</h4>
                          <div className="cart-item-meta">
                            Qty: {item.quantity || 1} • ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {currentCart.length > 1 && (
                      <div className="more-items-indicator">
                        +{currentCart.length - 1} more items
                      </div>
                    )}
                    <div className="price-preview">
                      <span>Total Amount</span>
                      <span>₹{currentFinalTotal.toFixed(2)}</span>
                    </div>
                    <div className="cart-preview-indicator">
                      Click to view full order details
                    </div>
                  </div>
                ) : (
                  <div className="order-summary-expanded">
                    <h2>Current Order Summary</h2>
                    <div className="cart-items-list">
                      {currentCart.map((item, index) => (
                        <div key={index} className="cart-item">
                          <div className="cart-image-container">
                            <img
                              src={item.image || 'https://via.placeholder.com/80'}
                              alt={item.name}
                              className="cart-item-image"
                            />
                          </div>
                          <div className="cart-item-details">
                            <h4 className="cart-item-name">{item.name}</h4>
                            <div className="cart-item-meta">
                              Qty: {item.quantity || 1} • ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="price-breakdown">
                      <div className="price-row">
                        <span>Subtotal</span>
                        <span>₹{currentTotal.toFixed(2)}</span>
                      </div>
                      {currentDeliveryCharge > 0 && (
                        <div className="price-row">
                          <span>Delivery Charge</span>
                          <span>₹{currentDeliveryCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="total-row">
                        <span>Total Amount</span>
                        <span>₹{currentFinalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    {address && (
                      <div className="address-details">
                        <h2>Delivery Address</h2>
                        <div className="order-summary-address-line">
                          <FaMapMarkerAlt className="address-icon" />
                          <p>{address.address}, {address.locality}
                            {address.landmark && `, ${address.landmark}`}</p>
                        </div>
                        <div className="order-summary-address-line">
                          <span className="icon-spacer"></span>
                          <p>{address.city}, {address.state} - {address.pincode}</p>
                        </div>
                        <div className="order-summary-address-line">
                          <FaUser className="address-icon" />
                          <p><strong>{address.name}</strong></p>
                        </div>
                        <div className="order-summary-address-line">
                          <FaPhoneAlt className="address-icon" />
                          <p><strong>Phone:</strong> {address.phone}</p>
                        </div>
                        {address.altPhone && (
                          <div className="order-summary-address-line">
                            <FaPhoneAlt className="address-icon" />
                            <p><strong>Alternate Phone:</strong> {address.altPhone}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : mostRecentOrder ? (
              <div className="recent-order-preview">
                <h3>Your Most Recent Order</h3>
                <div className="order-history-item">
                  <div className="order-header">
                    <h3>Order #{mostRecentOrder.id.toString().slice(-6)}</h3>
                    <span className="order-date">{formatDate(mostRecentOrder.date)}</span>
                    <span className={`order-status ${mostRecentOrder.status.toLowerCase()}`}>
                      {mostRecentOrder.status}
                    </span>
                  </div>
                  <div className="order-preview">
                    {mostRecentOrder.items.slice(0, 1).map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={item.image || 'https://via.placeholder.com/50'}
                          alt={item.name}
                          className="order-item-image"
                        />
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">Qty: {item.quantity || 1}</span>
                      </div>
                    ))}
                    {mostRecentOrder.items.length > 1 && (
                      <div className="order-more-items">
                        +{mostRecentOrder.items.length - 1} more items
                      </div>
                    )}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span>₹{mostRecentOrder.total.toFixed(2)}</span>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedOrderId(mostRecentOrder.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-orders-tab">
                <p>Your cart is empty</p>
                <button 
                  className="action-button" 
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </>
        ) : activeTab === 'history' && orderHistory.length > 0 ? (
          <>
            <div className="order-history">
              {currentOrders.map((order) => (
                <div key={order.id} className="order-history-item">
                  <div className="order-header">
                    <h3>Order #{order.id.toString().slice(-6)}</h3>
                    <span className="order-date">{formatDate(order.date)}</span>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-preview">
                    {order.items.slice(0, 1).map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={item.image || 'https://via.placeholder.com/50'}
                          alt={item.name}
                          className="order-item-image"
                        />
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">Qty: {item.quantity || 1}</span>
                      </div>
                    ))}
                    {order.items.length > 1 && (
                      <div className="order-more-items">
                        +{order.items.length - 1} more items
                      </div>
                    )}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {orderHistory.length > ordersPerPage && (
              <div className="pagination-controls">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  <FaChevronLeftIcon />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-orders-tab">
            <p>No order history yet</p>
            <button 
              className="action-button" 
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
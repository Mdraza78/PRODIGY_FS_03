import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Order.css';

const Order = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animation sequence
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
      
      // Show button after checkmark animation completes
      const buttonTimer = setTimeout(() => {
        setShowButton(true);
      }, 1000);
      
      return () => clearTimeout(buttonTimer);
    }, 800);

    return () => clearTimeout(animationTimer);
  }, []);

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="order-confirmation-container">
      <div className={`checkmark-circle ${animationComplete ? 'scale' : ''}`}>
        <svg 
          className="checkmark" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 52 52"
        >
          <circle 
            className="checkmark-circle-bg" 
            cx="26" 
            cy="26" 
            r="25" 
          />
          <path 
            className="checkmark-check" 
            fill="none" 
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
      
      <div className={`text-content ${animationComplete ? 'show' : ''}`}>
        <h1 className="order-confirmation-title">
          Order Placed Successfully!
        </h1>
        <p className="order-confirmation-message">
          Thank you for your order! We're currently processing it and will update you once it's on its way.
        </p>
      </div>
      
      {showButton && (
        <button 
          className="home-button"
          onClick={handleHomeClick}
        >
          Go to Home Page
        </button>
      )}
      
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="confetti" style={{
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }} />
        ))}
      </div>
    </div>
  );
};

export default Order;

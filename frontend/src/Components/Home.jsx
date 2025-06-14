import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Feature data
  const features = [
    {
      icon: '🛒',
      title: 'Wide Selection',
      description: 'Over 10,000 products from local and international brands'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Daily discounts and member-exclusive offers'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Same-day delivery available within city limits'
    }
  ];

  // Category data
  const categories = [
    {
      icon: '🍎',
      name: 'Fruits & Vegetables',
      path: '/products?category=fruits-vegetables'
    },
    {
      icon: '🥛',
      name: 'Dairy Products',
      path: '/products?category=dairy'
    },
    {
      icon: '🍞',
      name: 'Bakery Items',
      path: '/products?category=bakery'
    },
    {
      icon: '🥤',
      name: 'Beverages',
      path: '/products?category=beverages'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Welcome to <span className="highlight">Ratna Supermarket</span></h1>
            <p className="hero-subtitle">Your one-stop shop for fresh groceries and daily essentials</p>
            <div className="hero-buttons">
              <button 
                className="shop-now-btn primary-btn"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </button>
              <button 
                className="secondary-btn"
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <p className="section-subtitle">Quality products and exceptional service since 2010</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse our most popular departments</p>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div 
                className="category-card" 
                key={index}
                onClick={() => navigate(category.path)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join Our Membership Program</h2>
            <p>Get exclusive discounts, early access to sales, and reward points on every purchase</p>
            <div className="cta-buttons">
              <button 
                className="primary-btn"
                onClick={() => navigate('/register')}
              >
                Sign Up Now
              </button>
              <button 
                className="secondary-btn"
                onClick={() => navigate('/membership')}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
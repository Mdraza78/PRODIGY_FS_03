import React, { useState, useRef, useEffect } from 'react';
import './Nav.css';
import { FiSearch } from 'react-icons/fi';
import { FaShoppingCart, FaUser, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Nav({ user, handleLogout, onSearchChange, onSearchKeyPress, cartCount, openCart }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const handleLogoutClick = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } finally {
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="dashboard-nav">
            <div className="nav-left">
                <h1 className="nav-logo">Ratna Supermarket</h1>
            </div>

            <div className="search-container">
                <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={onSearchKeyPress}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="nav-right">
                <div className="cart-container" onClick={() => navigate("/cart")}>
                    <div className="cart-icon-container">
                        <FaShoppingCart className="cart-icon" />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </div>
                </div>

                <div className="user-dropdown" ref={dropdownRef}>
                    <div 
                        className="user-container"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="user-icon-container">
                            <FaUser className="user-icon" />
                        </div>
                       
                       
                    </div>
                    
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-header">
                                <p className="greeting">Hello, {user?.name || 'User'}</p>
                                {user?.phone && <p className="user-phone">{user.phone}</p>}
                            </div>
                            
                            <div className="dropdown-items">
                                <button 
                                    className="dropdown-item"
                                    onClick={() => {
                                        navigate("/myorder");
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <span className="item-icon">📦</span>
                                    <span className="item-text">My Orders</span>
                                </button>
                                
                                <button 
                                    className="dropdown-item"
                                    onClick={() => {
                                        navigate("/profile");
                                        setDropdownOpen(false);
                                    }}
                                >
                                    <span className="item-icon">👤</span>
                                    <span className="item-text">Profile</span>
                                </button>
                            </div>

                            <div className="dropdown-footer">
                                <button 
                                    className="dropdown-item logout"
                                    onClick={handleLogoutClick}
                                >
                                    <span className="item-icon">🚪</span>
                                    <span className="item-text">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
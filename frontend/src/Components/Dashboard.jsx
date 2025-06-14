import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Nav from './Nav';

export default function Dashboard({ cart, setCart, handleLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [filters, setFilters] = useState({
    availability: { includeOutOfStock: false },
    categories: { icecream: false, noodles: false, biscuits: false },
    priceRange: [0, 1000]
  });


  const products = [
    {
      id: 1,
      name: "Kwality Walls ChocoBar Ice Cream 50g | (Pack of 5)",
      image: 'https://imgs.search.brave.com/InjpqI2aV6QzLlmz7X987Cu-vtC07d_I8I0hYAXfp1M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDF3VmU2V2ZTMEwu/anBn',
      price: 100,
      originalPrice: 120,
      discountPercent: 16,
      category: 'icecream'
    },
    {
      id: 2,
      name: 'Maggi 2-Minute Masala Instant Noodles (560g)',
      image: 'https://imgs.search.brave.com/QVzDgTYVqWjSYnIEPpdyGrJS9Dc8W2czf68Yw5tmR0U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/amlvbWFydC5jb20v/aW1hZ2VzL3Byb2R1/Y3Qvb3JpZ2luYWwv/NDkwMDAzODM0L21h/Z2dpLTItbWludXRl/LW1hc2FsYS1pbnN0/YW50LW5vb2RsZXMt/NTYwLWctcHJvZHVj/dC1pbWFnZXMtbzQ5/MDAwMzgzNC1wNDkw/MDAzODM0LTAtMjAy/NDA2MjQxODM2Lmpw/Zz9pbT1SZXNpemU9/KDQyMCw0MjAp',
      price: 105,
      originalPrice: 120,
      discountPercent: 12,
      category: 'noodles'
    },
    {
      id: 3,
      name: 'Maggi Nutri-licious Masala Instant Veg Atta Noodles (72.5 g)',
      image: 'https://imgs.search.brave.com/HeXzYJf8A2Hz3gL-Bg5mPOzSdVdb1JctsUXSWNKv7XM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/emVwdG9ub3cuY29t/L3Byb2R1Y3Rpb24v/aWstc2VvL3RyOnct/NjQwLGFyLTE1MDAt/MTUwMCxwci10cnVl/LGYtYXV0byxxLTgw/L2ludmVudG9yeS9w/cm9kdWN0LzNlM2Ni/NjkwLTAxMDUtNDNm/MS04ZDcxLWNiNzJj/OGMwMTY3YS01MTJh/Y2ViZC1kMzlmLTQ0/NDAtYmE0MS0zZWM0/ZjFjMmExZDMvTWFn/Z2ktQXR0YS1Ob29k/bGVzLmpwZWc',
      price: 28,
      originalPrice: 30,
      discountPercent: 6,
      category: 'noodles'
    },
    {
      id: 4,
      name: "Kwality Walls The Dairy Factory Vanilla Ice Cream 700 ml",
      image: 'https://www.jiomart.com/images/product/original/494574643/kwality-walls-the-dairy-factory-slow-churned-vanilla-ice-cream-700-ml-product-images-o494574643-p611453916-0-202505151944.jpg?im=Resize=(420,420)',
      price: 108,
      originalPrice: 120,
      discountPercent: 10,
      category: 'icecream'
    },
    {
      id: 5,
      name: "Kwality Wall's Dazzli Tutti Frutti Ice Cream 700 ml (Carton)",
      image: 'https://www.jiomart.com/images/product/original/491390856/kwality-wall-s-dazzli-tutti-frutti-ice-cream-700-ml-carton-product-images-o491390856-p590110239-0-202305021237.jpg?im=Resize=(1000,1000)',
      price: 116,
      originalPrice: 155,
      discountPercent: 25,
      category: 'icecream'
    },
    {
      id: 6,
      name: "Amul Black Currant Ice Cream 750ml | (Pack of 2)",
      image: 'data:image/jpeg;base64,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',
      price: 199,
      originalPrice: 250,
      discountPercent: 20,
      category: 'icecream'
    },
    {
      id: 7,
      name: "Amul chocolate flavour Ice Cream 750ml | (Pack of 2)",
      image: 'https://imgs.search.brave.com/8SToOrVwaN7mUaSorq7A5ZCkP3WigMByjrShj_54ppo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFRVUFKNHFYcEwu/anBn',
      price: 199,
      originalPrice: 250,
      discountPercent: 20,
      category: 'icecream'
    },
    {
      id: 8,
      name: "Vadilal Rajbhog Special Ice Cream 750ml | (Pack of 2)",
      image: 'https://imgs.search.brave.com/m9bbtHQjjC8xFNnRKWGyQa4Vwkq1FcFqrbjlbhTUo1s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pdHNy/ZWxlYXNlZC51ay93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyNC8x/MS9zc3NjYy5wbmc',
      price: 280,
      originalPrice: 300,
      discountPercent: 6,
      category: 'icecream'
    },
    {
      id: 9,
      name: "Vadilal Mava Badam Ice Cream 750ml | (Pack of 2)",
      image: 'https://imgs.search.brave.com/OxInW3aZjrjAmsFJ-KPQOyt-yWbQO3gZybxy6CVK8Gg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDcv/NjIxL2ZyZXNoLXZh/ZGlsYWwtbWF3YS1i/YWRhbS1jcmVhbXkt/YW5kLXRhc3R5LWlj/ZS1jcmVhbS1mb3It/a2lkcy1hbmQtYWR1/bHRzLTEyOC5qcGc',
      price: 280,
      originalPrice: 300,
      discountPercent: 6,
      category: 'icecream'
    },
    {
      id: 10,
      name: "Amul Probioitic ChocoBar Ice Cream 50ml",
      image: 'https://imgs.search.brave.com/pOEqafVPmqVhPxapgtdwIypa-sw9AyfXGVMDlb5OLnw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pa2Fy/dC5pbi93ZWIvaW1h/Z2UvcHJvZHVjdC5w/cm9kdWN0LzkyNzkv/aW1hZ2VfMTAyNC9B/bXVsJTIwQ2hvY29i/YXIlMjBQcm9iaW90/aWMlMjBJY2UlMjBD/cmVhbSUyMFN0aWNr/JTIwMjJnbT91bmlx/dWU9MzVkZGEzMg',
      price: 18,
      originalPrice: 20,
      discountPercent: 10,
      category: 'icecream'
    },
    {
      id: 11,
      name: "Kwality Walls The Dairy Factory Alphonso Mango Ice Cream 700 ml",
      image: 'https://www.jiomart.com/images/product/original/494574644/kwality-walls-the-dairy-factory-slow-churned-alphonso-mango-ice-cream-700-ml-product-images-o494574644-p611453926-0-202505151952.jpg?im=Resize=(420,420)',
      price: 135,
      originalPrice: 150,
      discountPercent: 10,
      category: 'icecream'
    },
    {
      id: 12,
      name: "YiPPee! Magic Masala Noodles with Added Veggies 420g",
      image: 'https://www.jiomart.com/images/product/original/491337398/sunfeast-yippee-magic-masala-noodles-420-g-product-images-o491337398-p491337398-0-202406181926.jpg?im=Resize=(1000,1000)',
      price: 72,
      originalPrice: 90,
      discountPercent: 20,
      category: 'noodles'
    },
    {
      id: 13,
      name: "Ching's Secret Schezwan Instant Noodles 240 g",
      image: 'https://www.jiomart.com/images/product/original/490544386/ching-s-secret-schezwan-instant-noodles-240-g-product-images-o490544386-p490544386-0-202203150440.jpg?im=Resize=(420,420)',
      price: 40,
      originalPrice: 80,
      discountPercent: 50,
      category: 'noodles'
    },
    {
      id: 14,
      name: "Ching's Secret Hot Garlic Instant Noodles 240 g",
      image: 'https://www.jiomart.com/images/product/original/490544388/ching-s-secret-hot-garlic-instant-noodles-240-g-product-images-o490544388-p490544388-0-202203150746.jpg?im=Resize=(420,420)',
      price: 40,
      originalPrice: 80,
      discountPercent: 50,
      category: 'noodles'
    },
    {
      id: 15,
      name: "Maggi 2-Minute Instant Masala Noodles 768 g (Pack of 16)",
      image: 'https://www.jiomart.com/images/product/original/492862378/maggi-2-minute-masala-noodles-768-g-pack-of-16-product-images-o492862378-p597650845-0-202505160239.jpg?im=Resize=(420,420)',
      price: 148, 
      originalPrice: 160,
      discountPercent: 11,
      category: 'noodles'
    },
    {
      id: 16,
      name: "Sunfeast YiPPee! Magic Masala Noodles 560 g",
      image: 'https://www.jiomart.com/images/product/original/493857051/sunfeast-yippee-magic-masala-noodles-560-g-product-images-o493857051-p606011399-0-202406041749.jpg?im=Resize=(420,420)',
      price: 102, 
      originalPrice: 120,
      discountPercent: 15,
      category: 'noodles'
    },
    {
      id: 17,
      name: "Top Ramen Masala Instant Noodles 360 g",
      image: 'https://www.jiomart.com/images/product/original/490006655/top-ramen-new-masala-instant-noodles-360-g-product-images-o490006655-p490006655-0-202304280422.jpg?im=Resize=(420,420)',
      price: 58, 
      originalPrice: 88,
      discountPercent: 34,
      category: 'noodles'
    },
    {
      id: 18,
      name: "Top Ramen Curry Noodles 280 g",
      image: 'https://www.jiomart.com/images/product/original/490006656/top-ramen-curry-saucy-flat-instant-noodles-280-g-pouch-product-images-o490006656-p490006656-0-202203171022.jpg?im=Resize=(1000,1000)',
      price: 104, 
      originalPrice: 110,
      discountPercent: 5,
      category: 'noodles'
    },
    {
      id: 19,
      name: "Top Ramen Fiery Chilly Noodles 240 g",
      image: 'https://www.jiomart.com/images/product/original/490870323/top-ramen-fiery-chilli-noodles-240-g-product-images-o490870323-p490870323-0-202304280302.jpg?im=Resize=(420,420)',
      price: 76, 
      originalPrice: 80,
      discountPercent: 5,
      category: 'noodles'
    },
    {
      id: 20,
      name: "Ching's Secret Just Soak Veg Hakka Noodles 140 g",
      image: 'https://www.jiomart.com/images/product/original/490000264/ching-s-secret-just-soak-veg-hakka-noodles-140-g-product-images-o490000264-p490000264-0-202208121332.jpg?im=Resize=(420,420)',
      price: 28, 
      originalPrice: 30,
      discountPercent: 6,
      category: 'noodles'
    },
     {
      id: 21,
      name: "Kwality Wall's Feast Chocolate Ice Cream 70 ml (Pack)",
      image: 'https://www.jiomart.com/images/product/original/490001513/kwality-wall-s-feast-chocolate-ice-cream-70-ml-pack-product-images-o490001513-p595122193-0-202211071702.jpg?im=Resize=(420,420)',
      price: 27,
      originalPrice: 30,
      discountPercent: 10,
      category: 'icecream'
    },
    {
      id: 22,
      name: "Britannia Jimjam Sandwich Biscuits 138 g",
      image: 'https://www.jiomart.com/images/product/original/490876695/britannia-jimjam-sandwich-biscuits-138-g-product-images-o490876695-p490876695-0-202306121927.jpg?im=Resize=(420,420)',
      price: 34.00,
      originalPrice: 40,
      discountPercent: 15,
      category: 'biscuits'
    },
     {
      id: 23,
      name: "Sunfeast Dark Fantasy Bourbon Chocolate flavour 111.6 g",
      image: 'https://www.jiomart.com/images/product/original/493031619/sunfeast-dark-fantasy-bourbon-biscuits-111-6-g-product-images-o493031619-p593405131-0-202405311724.jpg?im=Resize=(420,420)',
      price: 17.00,
      originalPrice: 35,
      discountPercent: 51,
      category: 'biscuits'
    },
     {
      id: 24,
      name: "Cadbury Oreo Pokemon Vanilla Cream Biscuit 41.75g (Pack of 10)",
      image: 'https://www.jiomart.com/images/product/original/491070871/oreo-original-vanilla-cream-sandwich-biscuits-by-cadbury-41-75-g-product-images-o491070871-p491070871-0-202501191721.jpg?im=Resize=(420,420)',
      price: 90.00,
      originalPrice: 100,
      discountPercent: 10,
      category: 'biscuits'
    },
    {
      id: 25,
      name: "Britannia Bourbon The Original Cream Biscuits 150g",
      image: 'https://www.jiomart.com/images/product/original/490005349/britannia-bourbon-the-original-cream-biscuits-150-g-product-images-o490005349-p490005349-0-202501161201.jpg?im=Resize=(420,420)',
      price: 34.00,
      originalPrice: 40,
      discountPercent: 15,
      category: 'biscuits'
    },
    {
      id: 26,
      name: "Britannia 50-50 Butter Maska Chaska Biscuits 40.5 g (Pack of 10)",
      image: 'https://www.jiomart.com/images/product/original/490006829/britannia-50-50-maska-chaska-biscuits-40-5-g-product-images-o490006829-p490006829-0-202208301303.jpg?im=Resize=(420,420)',
      price: 90.00,
      originalPrice: 100,
      discountPercent: 10,
      category: 'biscuits'
    },
     {
      id: 27,
      name: "Parle Monaco Classic salted Regular Biscuits 696 g",
      image: 'https://www.jiomart.com/images/product/original/492578833/parle-monaco-classic-regular-biscuits-696-g-product-images-o492578833-p590992316-0-202502221300.jpg?im=Resize=(420,420)',
      price: 100.00,
      originalPrice: 150,
      discountPercent: 33,
      category: 'biscuits'
    },
    {
      id: 28,
      name: "Britannia 50-50 Sweet & Salty Biscuits 188 g (Pack of 2)",
      image: 'https://www.jiomart.com/images/product/original/491064244/britannia-50-50-sweet-salty-biscuits-188-g-product-images-o491064244-p491064244-0-202405250931.jpg?im=Resize=(420,420)',
      price: 76.00,
      originalPrice: 80,
      discountPercent: 5,
      category: 'biscuits'
    },
    {
    id: 29,
    name: "Britannia Treat Choco Creme Wafers Biscuit 55 g",
    image: "https://www.jiomart.com/images/product/original/492489342/britannia-treat-choco-flavour-creme-wafers-biscuit-55-g-product-images-o492489342-p591012886-0-202212201238.jpg?im=Resize=(420,420)",
    price: 25,
    originalPrice: 50,
    discountPercent: 50,
    category: "biscuits"
  },
   {
    id: 30,
    name: "Parle-G Classic Original Glucose Biscuits 800 g",
    image: "https://www.jiomart.com/images/product/original/490008739/parle-g-original-glucose-biscuits-800-g-product-images-o490008739-p490008739-0-202203170454.jpg?im=Resize=(420,420)",
    price: 92,
    originalPrice: 100,
    discountPercent: 8,
    category: "biscuits"
  },
  {
    id: 31,
    name: "Parle Krackjack The Original Sweet and Salty Cracker Biscuits 700 g",
    image: "https://www.jiomart.com/images/product/original/492578834/parle-krackjack-the-original-sweet-and-salty-cracker-biscuits-16-individual-product-images-o492578834-p590992317-0-202309121431.jpg?im=Resize=(420,420)",
    price: 100,
    originalPrice: 150,
    discountPercent: 33,
    category: "biscuits"
  }

  ];

const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= filters.priceRange[0] && 
                         product.price <= filters.priceRange[1];
    const anyCategorySelected = Object.values(filters.categories).some(val => val);
    const matchesCategory = !anyCategorySelected || 
      (filters.categories.icecream && product.category === "icecream") ||
      (filters.categories.noodles && product.category === "noodles") ||
      (filters.categories.biscuits && product.category === "biscuits");
    return matchesSearch && matchesPrice && matchesCategory;
  });

  // Pagination
  const productsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // User authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser({ name: parsedUser.fullName });
    }
  }, [navigate]);

  // Filter handlers (keep only one definition)
  const handleFilterChange = (filterType, key, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [key]: value
      }
    }));
    setCurrentPage(1);
  };

  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    setFilters(prev => ({
      ...prev,
      priceRange: newPriceRange
    }));
    setCurrentPage(1);
  };

  // Search handlers
  const handleSearchInput = (value) => {
    setSearchInput(value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }
  };

  // Add to cart
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Cart modal
  function CartModal({ cart, onClose }) {
    return (
      <div className="cart-modal-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={e => e.stopPropagation()}>
          <div className="cart-modal-header">
            <h2>Your Cart</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.id}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    width="40" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity || 1}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Nav
        user={user}
        handleLogout={handleLogout}
        onSearchChange={handleSearchInput}
        onSearchKeyPress={handleSearchKeyPress}
        cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        openCart={() => setIsCartOpen(true)}
      />

      <div className="dashboard-content">
        <div className="dashboard-layout">
          <div className="filters-sidebar">
            <h3>Filters</h3>
            <div className="filter-section">
              <h4>Availability</h4>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.availability.includeOutOfStock}
                  onChange={(e) => handleFilterChange('availability', 'includeOutOfStock', e.target.checked)}
                />
                <span>Include Out of stock</span>
              </label>
            </div>
            <div className="divider"></div>
            <div className="filter-section">
              <h4>Categories</h4>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories.icecream}
                  onChange={(e) => handleFilterChange('categories', 'icecream', e.target.checked)}
                />
                <span>Ice cream</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories.noodles}
                  onChange={(e) => handleFilterChange('categories', 'noodles', e.target.checked)}
                />
                <span>Noodles</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.categories.biscuits}
                  onChange={(e) => handleFilterChange('categories', 'biscuits', e.target.checked)}
                />
                <span>Biscuits</span>
              </label>
            </div>
            <div className="divider"></div>
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-range">
                <div className="price-input">
                  <span>₹</span>
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    min="0"
                  />
                </div>
                <span className="price-separator">-</span>
                <div className="price-input">
                  <span>₹</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    min={filters.priceRange[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="products-container">
            {searchQuery && <h2>Search Results for: <em>{searchQuery}</em></h2>}
            <div className="product-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <div className="product-card" key={product.id}>
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                    <p className="product-name">{product.name}</p>
                    <div className="price-section">
                      <span className="discounted-price">₹{product.price.toFixed(2)}</span>
                      <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                      <span className="discount-percent">{product.discountPercent}% OFF</span>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <span>Add</span>
                      <span className="plus-icon">+</span>
                    </button>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? 'active' : ''}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCartOpen && <CartModal cart={cart} onClose={() => setIsCartOpen(false)} />}
    </div>
  );
}

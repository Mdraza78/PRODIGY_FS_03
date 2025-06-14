const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
userSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  image: String,
  category: String
});
const Product = mongoose.model('Product', productSchema);

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1 
  },
  size: String
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  items: [cartItemSchema],
  modified: { 
    type: Date, 
    default: Date.now 
  }
});
cartSchema.index({ user: 1 }, { unique: true });
const Cart = mongoose.model('Cart', cartSchema);

// Token blacklist for logout
const tokenBlacklist = new Set();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  if (tokenBlacklist.has(token)) return res.status(403).json({ message: 'Token revoked' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') return res.status(403).json({ message: 'Token expired' });
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Register Route
app.post('/api/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { id: user._id, fullName: user.fullName, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
app.post('/api/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) tokenBlacklist.add(token);
  res.json({ message: 'Logged out successfully' });
});

// Protected Dashboard Route
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ 
      message: 'Welcome to your dashboard',
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add sample product (for testing)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { 
        items: req.body,
        modified: Date.now()
      },
      { upsert: true, new: true }
    ).populate('items.product');
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Merge guest cart with user cart after login
app.put('/api/cart/merge', authenticateToken, async (req, res) => {
  try {
    const userCart = await Cart.findOne({ user: req.user.id });
    const guestItems = req.body;

    if (userCart) {
      guestItems.forEach(guestItem => {
        const existing = userCart.items.find(i => 
          i.product.equals(guestItem.product._id) && 
          i.size === guestItem.size
        );
        if (existing) {
          existing.quantity += guestItem.quantity;
        } else {
          userCart.items.push({ ...guestItem, product: guestItem.product._id });
        }
      });
      await userCart.save();
    } else {
      await Cart.create({
        user: req.user.id,
        items: guestItems.map(({ product, ...rest }) => ({
          ...rest,
          product: product._id
        }))
      });
    }

    const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(updatedCart.items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

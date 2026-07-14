const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─── USER Auth ─────────────────────────────────────────────────────────────
router.post('/user/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id, 'user');
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id, 'user');
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── SELLER Auth ────────────────────────────────────────────────────────────
router.post('/seller/signup', async (req, res) => {
  try {
    const { name, email, password, storeName, phone } = req.body;
    const exists = await Seller.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const seller = await Seller.create({ name, email, password, storeName, phone });
    const token = generateToken(seller._id, 'seller');
    res.status(201).json({
      token,
      user: { _id: seller._id, name: seller.name, email: seller.email, storeName: seller.storeName, approved: seller.approved, role: 'seller' }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/seller/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller || !(await seller.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (seller.blocked) return res.status(403).json({ message: 'Your account has been blocked by admin' });

    const token = generateToken(seller._id, 'seller');
    res.json({
      token,
      user: { _id: seller._id, name: seller.name, email: seller.email, storeName: seller.storeName, approved: seller.approved, role: 'seller' }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADMIN Auth ─────────────────────────────────────────────────────────────
router.post('/admin/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const admin = await Admin.create({ name, email, password });
    const token = generateToken(admin._id, 'admin');
    res.status(201).json({ token, user: { _id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(admin._id, 'admin');
    res.json({ token, user: { _id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

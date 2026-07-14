const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Order = require('../models/Order');
const { protect, requireRole } = require('../middleware/auth');

// Get seller's books
router.get('/books', protect, requireRole('seller'), async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get seller stats
router.get('/stats', protect, requireRole('seller'), async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments({ seller: req.user._id });
    const orders = await Order.find({ 'items.seller': req.user._id });
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, o) => {
      const sellerItems = o.items.filter(i => i.seller && i.seller.toString() === req.user._id.toString());
      return acc + sellerItems.reduce((a, i) => a + i.price * i.quantity, 0);
    }, 0);
    const delivered = orders.filter(o => o.orderStatus === 'Delivered').length;
    res.json({ totalBooks, totalOrders, totalRevenue, delivered });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get seller profile
router.get('/profile', protect, requireRole('seller'), async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

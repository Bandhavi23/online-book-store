const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Seller = require('../models/Seller');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { protect, requireRole } = require('../middleware/auth');

// Admin stats overview
router.get('/stats', protect, requireRole('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const revenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenue[0]?.total || 0;

    // 1. Books count per genre (for Pie/Donut charts)
    const booksByGenre = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 2. Sales Over Time - last 10 days (for Bar/Histogram charts)
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const salesOverTime = await Order.aggregate([
      { $match: { createdAt: { $gte: tenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing dates to make the chart smooth
    const salesMap = new Map(salesOverTime.map(s => [s._id, s]));
    const formattedSales = [];
    for (let i = 9; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = salesMap.get(dateStr);
      formattedSales.push({
        date: dateStr,
        revenue: match ? match.revenue : 0,
        orders: match ? match.orders : 0
      });
    }

    // 3. Order status count (for Pie/Donut/Bar charts)
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // 4. Seller approval stats
    const approvedSellers = await Seller.countDocuments({ approved: true });
    const pendingSellers = await Seller.countDocuments({ approved: false });

    res.json({
      totalUsers,
      totalSellers,
      totalBooks,
      totalOrders,
      totalRevenue,
      booksByGenre,
      salesOverTime: formattedSales,
      ordersByStatus,
      sellerStats: { approved: approvedSellers, pending: pendingSellers }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/users/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all sellers
router.get('/sellers', protect, requireRole('admin'), async (req, res) => {
  try {
    const sellers = await Seller.find().select('-password').sort({ createdAt: -1 });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve / toggle seller
router.put('/sellers/:id/approve', protect, requireRole('admin'), async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    seller.approved = !seller.approved;
    await seller.save();
    res.json({ message: `Seller ${seller.approved ? 'approved' : 'unapproved'}`, seller });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Block / unblock seller
router.put('/sellers/:id/block', protect, requireRole('admin'), async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    seller.blocked = !seller.blocked;
    await seller.save();
    res.json({ message: `Seller ${seller.blocked ? 'blocked' : 'unblocked'}`, seller });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete seller
router.delete('/sellers/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: 'Seller deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all books (admin view)
router.get('/books', protect, requireRole('admin'), async (req, res) => {
  try {
    const books = await Book.find().populate('seller', 'storeName name').sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete book (admin)
router.delete('/books/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

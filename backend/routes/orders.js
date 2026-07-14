const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Book = require('../models/Book');
const { protect, requireRole } = require('../middleware/auth');

// Place new order (user)
router.post('/', protect, requireRole('user'), async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) return res.status(404).json({ message: `Book ${item.bookId} not found` });
      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${book.title}"` });
      }
      book.stock -= item.quantity;
      await book.save();

      totalAmount += book.price * item.quantity;
      orderItems.push({
        book: book._id,
        title: book.title,
        image: book.image,
        price: book.price,
        quantity: item.quantity,
        seller: book.seller
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD'
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's orders
router.get('/my', protect, requireRole('user'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get seller's orders
router.get('/seller', protect, requireRole('seller'), async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders (admin)
router.get('/all', protect, requireRole('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (seller/admin)
router.put('/:id/status', protect, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel order (user)
router.put('/:id/cancel', protect, requireRole('user'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (['Shipped', 'Delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel a shipped or delivered order' });
    }
    order.orderStatus = 'Cancelled';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, { $inc: { stock: item.quantity } });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

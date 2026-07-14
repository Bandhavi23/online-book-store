const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');

// Get user profile
router.get('/profile', protect, requireRole('user'), async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/profile', protect, requireRole('user'), async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

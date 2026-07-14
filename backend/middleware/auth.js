const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    if (role === 'user') {
      req.user = await User.findById(id).select('-password');
    } else if (role === 'seller') {
      req.user = await Seller.findById(id).select('-password');
    } else if (role === 'admin') {
      req.user = await Admin.findById(id).select('-password');
    }

    if (!req.user) return res.status(401).json({ message: 'User not found' });
    req.role = role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.role)) {
    return res.status(403).json({ message: `Access denied: requires role ${roles.join(' or ')}` });
  }
  next();
};

module.exports = { protect, requireRole };

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const Review = require('../models/Review');
const { protect, requireRole } = require('../middleware/auth');

// Multer config for book images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all books (public) with search/filter
router.get('/', async (req, res) => {
  try {
    const { search, genre, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre && genre !== 'All') filter.genre = genre;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'newest') sortObj = { createdAt: -1 };

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('seller', 'storeName name');

    res.json({ books, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET featured books (public)
router.get('/featured', async (req, res) => {
  try {
    const books = await Book.find({ featured: true }).limit(8).populate('seller', 'storeName');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single book (public)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('seller', 'storeName name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const reviews = await Review.find({ book: book._id }).sort({ createdAt: -1 });
    res.json({ book, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE book (seller only)
router.post('/', protect, requireRole('seller'), upload.single('image'), async (req, res) => {
  try {
    const { title, author, description, price, originalPrice, stock, genre, language, publisher, publishedYear, pages, isbn, featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const book = await Book.create({
      title, author, description,
      price: Number(price),
      originalPrice: Number(originalPrice) || 0,
      stock: Number(stock),
      genre, language, publisher,
      publishedYear: Number(publishedYear) || 0,
      pages: Number(pages) || 0,
      isbn, image,
      seller: req.user._id,
      sellerName: req.user.storeName,
      featured: featured === 'true'
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE book (seller who owns it)
router.put('/:id', protect, requireRole('seller'), upload.single('image'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE book
router.delete('/:id', protect, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (req.role === 'seller' && book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD review (user only)
router.post('/:id/reviews', protect, requireRole('user'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = await Review.create({
      book: book._id,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    });

    const reviews = await Review.find({ book: book._id });
    book.numReviews = reviews.length;
    book.rating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await book.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

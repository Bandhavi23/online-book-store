const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  genre: {
    type: String,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Children', 'Fantasy', 'History', 'Self-Help', 'Technology', 'Other'],
    default: 'Other'
  },
  language: { type: String, default: 'English' },
  publisher: { type: String, default: '' },
  publishedYear: { type: Number, default: 0 },
  pages: { type: Number, default: 0 },
  isbn: { type: String, default: '' },
  image: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  sellerName: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);

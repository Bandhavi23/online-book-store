import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingCart, ArrowLeft, Package, BookOpen, MessageSquare } from 'lucide-react';

const API = '/api';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={24} fill={(hover || value) >= s ? '#f59e0b' : 'none'} color={(hover || value) >= s ? '#f59e0b' : '#64748b'} style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => onChange(s)} />
      ))}
    </div>
  );
}

export default function Uitem() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchBook(); }, [id]);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`${API}/books/${id}`);
      setBook(res.data.book);
      setReviews(res.data.reviews || []);
    } catch { toast.error('Book not found'); navigate('/user/products'); }
    finally { setLoading(false); }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('bs_cart') || '[]');
    const existing = cart.find(c => c._id === book._id);
    const newCart = existing
      ? cart.map(c => c._id === book._id ? { ...c, qty: c.qty + 1 } : c)
      : [...cart, { ...book, qty: 1 }];
    localStorage.setItem('bs_cart', JSON.stringify(newCart));
    toast.success('Added to cart! 🛒');
  };

  const submitReview = async e => {
    e.preventDefault();
    if (!review.rating) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await axios.post(`${API}/books/${id}/reviews`, review, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Review posted!');
      setReview({ rating: 0, comment: '' });
      fetchBook();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading-wrapper" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!book) return null;

  const disc = book.originalPrice > book.price ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/user/home" className="navbar-brand"><span className="brand-icon">📚</span> BookStore</Link>
          <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Back</button>
        </div>
      </nav>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Book Image */}
          <div>
            {book.image
              ? <img src={book.image} alt={book.title} style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }} />
              : <div style={{ width: '100%', height: 380, background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>📚</div>
            }
          </div>

          {/* Book Info */}
          <div>
            <span className="book-genre-badge" style={{ marginBottom: '1rem' }}>{book.genre}</span>
            <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2.5rem)', marginBottom: '0.5rem' }}>{book.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>by <strong style={{ color: 'var(--primary-light)' }}>{book.author}</strong></p>

            {book.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={18} fill={book.rating >= s ? '#f59e0b' : 'none'} color={book.rating >= s ? '#f59e0b' : '#64748b'} />)}
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{book.rating.toFixed(1)} ({book.numReviews} reviews)</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>₹{book.price}</span>
              {book.originalPrice > book.price && (
                <><span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.1rem' }}>₹{book.originalPrice}</span>
                <span className="price-discount">{disc}% off</span></>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{book.description || 'No description available.'}</p>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {[
                ['Publisher', book.publisher], ['Language', book.language], ['Year', book.publishedYear], ['Pages', book.pages],
                ['ISBN', book.isbn], ['Stock', `${book.stock} available`], ['Seller', book.seller?.storeName || 'Unknown']
              ].filter(([,v]) => v && v !== '0' && v !== 0).map(([label, value]) => (
                <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={addToCart} disabled={book.stock === 0}>
                <ShoppingCart size={18} /> {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <Link to="/user/orders" className="btn btn-outline btn-lg"><Package size={18} /> My Orders</Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> Reviews ({reviews.length})
          </h2>

          {/* Write Review */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', marginBottom: '1rem' }}>Write a Review</h3>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Your Rating</label>
                <StarRating value={review.rating} onChange={r => setReview({ ...review, rating: r })} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea className="form-textarea" placeholder="Share your thoughts about this book..." value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} required rows={3} />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          </div>

          {reviews.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">⭐</div><h3>No reviews yet</h3><p>Be the first to review this book!</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map(r => (
                <div key={r._id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{r.userName}</div>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={r.rating >= s ? '#f59e0b' : 'none'} color={r.rating >= s ? '#f59e0b' : '#64748b'} />)}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

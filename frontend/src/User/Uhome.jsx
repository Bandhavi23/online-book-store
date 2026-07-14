import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, Search, Star, ArrowRight, BookOpen } from 'lucide-react';
import Footer from '../Components/Footer';

const API = '/api';

const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Children', 'Fantasy', 'History', 'Self-Help', 'Technology'];

function BookCard({ book, onAddToCart }) {
  const navigate = useNavigate();
  const discount = book.originalPrice > book.price
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  return (
    <div
      className="book-card"
      style={{ cursor: 'pointer' }}
    >
      <div onClick={() => navigate(`/user/book/${book._id}`)}>
        {book.image
          ? <img src={book.image} alt={book.title} className="book-card-image" />
          : <div className="book-card-placeholder">📚</div>
        }
        <div className="book-card-body">
          <span className="book-genre-badge">{book.genre}</span>
          <div className="book-title">{book.title}</div>
          <div className="book-author">by {book.author}</div>
          {book.rating > 0 && (
            <div className="book-rating">
              <Star size={13} fill="currentColor" />
              {book.rating.toFixed(1)} ({book.numReviews})
            </div>
          )}
          <div className="book-price">
            <span className="price-current">₹{book.price}</span>
            {book.originalPrice > book.price && (
              <>
                <span className="price-original">₹{book.originalPrice}</span>
                <span className="price-discount">{discount}% off</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          onClick={() => onAddToCart(book)}>
          <ShoppingCart size={15} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function Uhome() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre]);

  useEffect(() => {
    fetchFeatured();
    const savedCart = localStorage.getItem('bs_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const genreParam = selectedGenre !== 'All' ? `&genre=${selectedGenre}` : '';
      const res = await axios.get(`${API}/books?limit=12${genreParam}`);
      setBooks(res.data.books || []);
    } catch { toast.error('Failed to load books'); }
    finally { setLoading(false); }
  };

  const fetchFeatured = async () => {
    try {
      const res = await axios.get(`${API}/books/featured`);
      setFeatured(res.data);
    } catch {}
  };

  const addToCart = (book) => {
    const existing = cart.find(c => c._id === book._id);
    let newCart;
    if (existing) {
      newCart = cart.map(c => c._id === book._id ? { ...c, qty: c.qty + 1 } : c);
    } else {
      newCart = [...cart, { ...book, qty: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('bs_cart', JSON.stringify(newCart));
    toast.success(`"${book.title}" added to cart!`);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(c => c._id !== id);
    setCart(newCart);
    localStorage.setItem('bs_cart', JSON.stringify(newCart));
  };

  const updateQty = (id, delta) => {
    const newCart = cart.map(c => c._id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c).filter(c => c.qty > 0);
    setCart(newCart);
    localStorage.setItem('bs_cart', JSON.stringify(newCart));
  };

  const cartTotal = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  const cartCount = cart.reduce((acc, c) => acc + c.qty, 0);

  const handleCheckout = async () => {
    if (!cart.length) return;
    try {
      const shippingAddress = { street: 'Default', city: 'Hyderabad', state: 'Telangana', zipCode: '500001' };
      const items = cart.map(c => ({ bookId: c._id, quantity: c.qty }));
      await axios.post(`${API}/orders`, { items, shippingAddress, paymentMethod: 'COD' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart([]);
      localStorage.removeItem('bs_cart');
      setCartOpen(false);
      toast.success('Order placed successfully! 🎉');
      navigate('/user/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/user/home" className="navbar-brand">
            <span className="brand-icon">📚</span> BookStore
          </Link>
          <ul className="navbar-links">
            <li><Link to="/user/home" className="active">Home</Link></li>
            <li><Link to="/user/products">Browse</Link></li>
            <li><Link to="/user/orders">My Orders</Link></li>
          </ul>
          <div className="navbar-actions">
            <div className="user-badge"><BookOpen size={14} />{user?.name}</div>
            <button className="btn btn-outline btn-sm" onClick={() => setCartOpen(true)} style={{ position: 'relative' }}>
              <ShoppingCart size={16} />
              {cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--accent)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>}
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}><LogOut size={16} /></button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '4rem 0 3rem', background: 'var(--gradient-hero)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '1rem' }}>
            Hello, <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.name}!</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>What would you like to read today?</p>
          <div style={{ display: 'flex', gap: '1rem', maxWidth: 600, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: 240 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" placeholder="Search books, authors..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.75rem' }} onKeyDown={e => e.key === 'Enter' && navigate(`/user/products?search=${search}`)} />
            </div>
            <button className="btn btn-primary" onClick={() => navigate(`/user/products?search=${search}`)}>
              Search <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Genre Filter Row */}
      <div style={{ overflowX: 'auto', borderBottom: '1px solid var(--border)', background: 'rgba(13,18,48,0.6)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem 1.5rem', minWidth: 'max-content' }}>
          {GENRES.map(g => (
            <button key={g} onClick={() => setSelectedGenre(g)} style={{ padding: '0.45rem 1.1rem', borderRadius: 50, border: '1.5px solid', borderColor: selectedGenre === g ? 'var(--primary)' : 'var(--border)', background: selectedGenre === g ? 'var(--primary)' : 'transparent', color: selectedGenre === g ? 'white' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition-fast)', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>
              {selectedGenre === 'All' ? 'Latest Books' : selectedGenre}
            </h2>
            <Link to="/user/products" className="btn btn-outline btn-sm">View All <ArrowRight size={14} /></Link>
          </div>

          {loading ? (
            <div className="loading-wrapper"><div className="spinner" /><span>Loading books...</span></div>
          ) : (
            <div className="books-grid">
              {books
                .filter(b => selectedGenre === 'All' || b.genre === selectedGenre)
                .filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
                .map(book => <BookCard key={book._id} book={book} onAddToCart={addToCart} />)
              }
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Cart Panel */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-panel" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h3 style={{ fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} /> My Cart ({cartCount})
              </h3>
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', padding: 0 }}>×</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>Cart is empty</h3>
                <p>Add some books to get started!</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item._id} className="cart-item">
                    {item.image
                      ? <img src={item.image} alt={item.title} className="cart-item-img" style={{ borderRadius: 'var(--radius-sm)', height: 80, width: 60, objectFit: 'cover', flexShrink: 0 }} />
                      : <div className="cart-item-img">📚</div>
                    }
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.title}</div>
                      <div className="cart-item-price">₹{item.price}</div>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>−</button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item._id, 1)}>+</button>
                        <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', color: 'var(--danger)', fontSize: '0.8rem', padding: '0.2rem 0.5rem', cursor: 'pointer', border: '1px solid var(--danger)', borderRadius: 4 }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--accent)' }}>₹{cartTotal}</span>
                  </div>
                  <button className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

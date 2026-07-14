import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Star, ShoppingCart, ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react';

const API = '/api';
const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Children', 'Fantasy', 'History', 'Self-Help', 'Technology'];

export default function Products() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [genre, setGenre] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearch(query);
    fetchBooks(query);
  }, [searchParams, genre, sort, page]);

  const fetchBooks = async (currentSearch = search) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (currentSearch) params.search = currentSearch;
      if (genre !== 'All') params.genre = genre;
      const res = await axios.get(`${API}/books`, { params });
      setBooks(res.data.books || []);
      setTotalPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch { toast.error('Failed to load books'); }
    finally { setLoading(false); }
  };

  const handleSearch = e => {
    e.preventDefault();
    setPage(1);
    fetchBooks(search);
  };

  const addToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem('bs_cart') || '[]');
    const existing = cart.find(c => c._id === book._id);
    const newCart = existing
      ? cart.map(c => c._id === book._id ? { ...c, qty: c.qty + 1 } : c)
      : [...cart, { ...book, qty: 1 }];
    localStorage.setItem('bs_cart', JSON.stringify(newCart));
    toast.success(`"${book.title}" added to cart!`);
  };

  const discount = (b) => b.originalPrice > b.price ? Math.round((1 - b.price / b.originalPrice) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/user/home" className="navbar-brand"><span className="brand-icon">📚</span> BookStore</Link>
          <ul className="navbar-links">
            <li><Link to="/user/home">Home</Link></li>
            <li><Link to="/user/products" className="active">Browse</Link></li>
            <li><Link to="/user/orders">My Orders</Link></li>
          </ul>
          <Link to="/user/home" className="btn btn-outline btn-sm"><ArrowLeft size={14} /> Back</Link>
        </div>
      </nav>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* Search & Filters Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '0.75rem', minWidth: 260 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" placeholder="Search books or authors..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <select className="form-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} style={{ width: 'auto', minWidth: 160 }}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Genre Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {GENRES.map(g => (
            <button key={g} onClick={() => { setGenre(g); setPage(1); }} style={{ padding: '0.4rem 1rem', borderRadius: 50, border: '1.5px solid', borderColor: genre === g ? 'var(--primary)' : 'var(--border)', background: genre === g ? 'var(--primary)' : 'transparent', color: genre === g ? 'white' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition-fast)', fontFamily: 'Inter, sans-serif' }}>
              {g}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{total} books found</p>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><span>Loading books...</span></div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No books found</h3>
            <p>Try different search terms or filters</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => {
              const disc = discount(book);
              return (
                <div key={book._id} className="book-card">
                  <div onClick={() => navigate(`/user/book/${book._id}`)} style={{ cursor: 'pointer' }}>
                    {book.image
                      ? <img src={book.image} alt={book.title} className="book-card-image" />
                      : <div className="book-card-placeholder">📚</div>
                    }
                    <div className="book-card-body">
                      <span className="book-genre-badge">{book.genre}</span>
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">by {book.author}</div>
                      {book.rating > 0 && (
                        <div className="book-rating"><Star size={12} fill="currentColor" />{book.rating.toFixed(1)}</div>
                      )}
                      <div className="book-price">
                        <span className="price-current">₹{book.price}</span>
                        {book.originalPrice > book.price && (
                          <><span className="price-original">₹{book.originalPrice}</span><span className="price-discount">{disc}% off</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0 1.25rem 1.25rem' }}>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }} onClick={() => addToCart(book)}>
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ArrowLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ArrowRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

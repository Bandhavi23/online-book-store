import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Anavbar from './Anavbar';
import { Trash2, Search, Star } from 'lucide-react';

const API = '/api';

export default function Items() {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/admin/books`, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(res.data);
    } catch {
      toast.error('Failed to load books catalog');
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book listing from the platform?')) return;
    try {
      await axios.delete(`${API}/admin/books/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Book deleted successfully');
      setBooks(books.filter(b => b._id !== id));
    } catch {
      toast.error('Failed to delete book');
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.sellerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Anavbar />
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Catalog Moderation</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor and delete book catalog entries</p>
          </div>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search by title, author or seller..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          </div>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><span>Loading catalog...</span></div>
        ) : filteredBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No books cataloged</h3>
            <p>Either the database is empty or no books match your query.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book Details</th>
                  <th>Genre</th>
                  <th>Seller / Store</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(b => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {b.image ? (
                          <img src={b.image} alt={b.title} style={{ width: '32px', height: '42px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '32px', height: '42px', background: 'linear-gradient(135deg,#1e1b4b,#312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', borderRadius: '4px' }}>📚</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.title}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>by {b.author}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="book-genre-badge" style={{ margin: 0 }}>{b.genre}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{b.sellerName || b.seller?.storeName || '—'}</div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--accent)' }}>₹{b.price}</td>
                    <td>
                      <span className={`badge ${b.stock > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                        {b.stock > 0 ? `${b.stock} Left` : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      {b.rating > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.85rem', color: 'var(--accent)' }}>
                          <Star size={12} fill="currentColor" /> {b.rating.toFixed(1)}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No reviews</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteBook(b._id)} style={{ display: 'inline-flex', padding: '0.4rem' }} title="Delete Book Listing">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

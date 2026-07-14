import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Snavbar from './Snavbar';
import Book from './Book';
import './List.css';
import { BookPlus, Search, X } from 'lucide-react';

const API = '/api';
const GENRES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Children', 'Fantasy', 'History', 'Self-Help', 'Technology', 'Other'];

export default function MyProducts() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [editBook, setEditBook] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/sellers/books`, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(res.data);
    } catch { toast.error('Failed to load books'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`${API}/books/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Book deleted');
      setBooks(books.filter(b => b._id !== id));
    } catch { toast.error('Failed to delete book'); }
  };

  const openEdit = (book) => {
    setEditBook(book);
    setEditForm({
      title: book.title, author: book.author, price: book.price,
      originalPrice: book.originalPrice, stock: book.stock,
      description: book.description, genre: book.genre, featured: book.featured
    });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`${API}/books/${editBook._id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Book updated!');
      setEditBook(null);
      fetchBooks();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  const filtered = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genre === 'All' || b.genre === genre;
    return matchSearch && matchGenre;
  });

  return (
    <div className="dashboard-layout">
      <Snavbar />
      <main className="dashboard-content">
        <div className="list-header">
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>My Products</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your listed books</p>
          </div>
          <button className="btn btn-accent" onClick={() => navigate('/seller/add-book')}>
            <BookPlus size={16} /> Add New Book
          </button>
        </div>

        {/* Search & Genre Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="list-search" style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search your books..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {GENRES.slice(0, 7).map(g => (
              <button key={g} onClick={() => setGenre(g)} style={{ padding: '0.35rem 0.9rem', borderRadius: 50, border: '1.5px solid', borderColor: genre === g ? 'var(--accent)' : 'var(--border)', background: genre === g ? 'var(--accent)' : 'transparent', color: genre === g ? 'white' : 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', transition: 'var(--transition-fast)', fontFamily: 'Inter, sans-serif' }}>
                {g}
              </button>
            ))}
          </div>
          <span className="list-count">{filtered.length} books</span>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><span>Loading your books...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>{books.length === 0 ? 'No books listed yet' : 'No results found'}</h3>
            <p>{books.length === 0 ? 'Start by adding your first book!' : 'Try a different search or filter'}</p>
            {books.length === 0 && (
              <button className="btn btn-accent" style={{ marginTop: '1rem' }} onClick={() => navigate('/seller/add-book')}>
                <BookPlus size={16} /> Add First Book
              </button>
            )}
          </div>
        ) : (
          <div className="books-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {filtered.map(book => (
              <Book key={book._id} book={book} onDelete={handleDelete} onEdit={openEdit} />
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editBook && (
        <div className="cart-overlay" onClick={() => setEditBook(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '520px', maxWidth: '95vw', margin: 'auto', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.2rem' }}>Edit Book</h2>
              <button onClick={() => setEditBook(null)} style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '1.4rem', padding: 0 }}><X size={22} /></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input className="form-input" value={editForm.author} onChange={e => setEditForm({...editForm, author: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Orig. Price</label>
                  <input type="number" className="form-input" value={editForm.originalPrice} onChange={e => setEditForm({...editForm, originalPrice: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input type="number" className="form-input" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Genre</label>
                <select className="form-select" value={editForm.genre} onChange={e => setEditForm({...editForm, genre: e.target.value})}>
                  {GENRES.slice(1).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" rows={3} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-accent" disabled={updating} style={{ flex: 1, justifyContent: 'center' }}>
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditBook(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

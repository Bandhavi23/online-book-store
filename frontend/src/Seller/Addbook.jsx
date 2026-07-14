import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Snavbar from './Snavbar';
import { Upload, BookPlus, X } from 'lucide-react';

const API = '/api';
const GENRES = ['Fiction', 'Non-Fiction', 'Science', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Children', 'Fantasy', 'History', 'Self-Help', 'Technology', 'Other'];

export default function Addbook() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', author: '', description: '', price: '', originalPrice: '',
    stock: '', genre: 'Fiction', language: 'English', publisher: '',
    publishedYear: '', pages: '', isbn: '', featured: false
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.author || !form.price || !form.stock) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      await axios.post(`${API}/books`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Book added successfully! 📚');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book');
    } finally { setLoading(false); }
  };

  return (
    <div className="dashboard-layout">
      <Snavbar />
      <main className="dashboard-content">
        <div style={{ maxWidth: 800 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookPlus size={26} /> Add New Book
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Fill in the details to list your book on BookStore</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Left column */}
              <div>
                {/* Image Upload */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Book Cover Image</label>
                  <div
                    onClick={() => document.getElementById('img-input').click()}
                    style={{
                      width: '100%', height: 220, border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'var(--transition)', background: preview ? 'transparent' : 'rgba(255,255,255,0.02)',
                      overflow: 'hidden', position: 'relative'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    {preview ? (
                      <>
                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={e => { e.stopPropagation(); setPreview(null); setImage(null); }}
                          style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click to upload cover image</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>JPG, PNG up to 5MB</span>
                      </>
                    )}
                  </div>
                  <input id="img-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                </div>

                <div className="form-group">
                  <label className="form-label">Genre *</label>
                  <select name="genre" className="form-select" value={form.genre} onChange={handleChange}>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <input name="language" type="text" className="form-input" placeholder="English" value={form.language} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Publisher</label>
                  <input name="publisher" type="text" className="form-input" placeholder="Publisher name" value={form.publisher} onChange={handleChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Published Year</label>
                    <input name="publishedYear" type="number" className="form-input" placeholder="2023" value={form.publishedYear} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pages</label>
                    <input name="pages" type="number" className="form-input" placeholder="350" value={form.pages} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input name="isbn" type="text" className="form-input" placeholder="ISBN number" value={form.isbn} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)' }}>
                  <input type="checkbox" name="featured" id="featured" checked={form.featured} onChange={handleChange} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <label htmlFor="featured" style={{ cursor: 'pointer', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 500 }}>
                    ⭐ Mark as Featured Book
                  </label>
                </div>
              </div>

              {/* Right column */}
              <div>
                <div className="form-group">
                  <label className="form-label">Book Title *</label>
                  <input name="title" type="text" className="form-input" placeholder="Enter book title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Author *</label>
                  <input name="author" type="text" className="form-input" placeholder="Author name" value={form.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-textarea" placeholder="Describe this book..." value={form.description} onChange={handleChange} rows={5} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input name="price" type="number" className="form-input" placeholder="299" value={form.price} onChange={handleChange} required min={0} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (₹)</label>
                    <input name="originalPrice" type="number" className="form-input" placeholder="399" value={form.originalPrice} onChange={handleChange} min={0} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input name="stock" type="number" className="form-input" placeholder="Available copies" value={form.stock} onChange={handleChange} required min={0} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-accent btn-lg" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                    {loading ? 'Publishing...' : <><BookPlus size={18} /> Publish Book</>}
                  </button>
                  <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/seller/products')}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

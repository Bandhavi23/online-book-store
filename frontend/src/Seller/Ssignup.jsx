import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const API = '/api';

export default function Ssignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', storeName: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/seller/signup`, form);
      toast.success('Store registered! Awaiting admin approval. Please log in. 🎉');
      navigate('/seller/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <span className="logo-icon">📦</span>
          <h1>BookStore</h1>
          <p>Register your store</p>
        </div>
        <h2 className="auth-title">Become a Seller</h2>
        <p className="auth-subtitle">Start selling your books on BookStore today</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" className="form-input" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input" placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Store Name</label>
            <input type="text" className="form-input" placeholder="e.g. Kishore Books" value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="seller@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="At least 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingRight: '3rem' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '2.4rem', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="btn btn-accent" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Registering...' : 'Register Store'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/seller/login">Sign in</Link>
          <br /><br />
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

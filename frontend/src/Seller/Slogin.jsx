import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const API = '/api';

export default function Slogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/seller/login`, form);
      login(res.data.token, res.data.user, 'seller');
      toast.success(`Welcome back, ${res.data.user.name}! 📦`);
      navigate('/seller/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">📦</span>
          <h1>BookStore</h1>
          <p>Seller Portal</p>
        </div>
        <h2 className="auth-title">Seller Login</h2>
        <p className="auth-subtitle">Sign in to manage your store</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="seller@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="Your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingRight: '3rem' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '2.4rem', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="btn btn-accent" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Signing in...' : 'Sign In as Seller'}
          </button>
        </form>
        <div className="auth-footer">
          New seller? <Link to="/seller/signup">Register your store</Link>
          <br /><br />
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

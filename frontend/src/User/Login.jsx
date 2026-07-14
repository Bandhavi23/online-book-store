import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, BookOpen } from 'lucide-react';

const API = '/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/user/login`, form);
      login(res.data.token, res.data.user, 'user');
      toast.success(`Welcome back, ${res.data.user.name}! 👋`);
      navigate('/user/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">📚</span>
          <h1>BookStore</h1>
          <p>Reader Portal</p>
        </div>
        <h2 className="auth-title">Welcome Back!</h2>
        <p className="auth-subtitle">Sign in to continue your reading journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input type={showPw ? 'text' : 'password'} name="password" className="form-input" placeholder="Enter your password" value={form.password} onChange={handleChange} required style={{ paddingRight: '3rem' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '2.4rem', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/user/signup">Create one</Link>
          <br />
          <br />
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

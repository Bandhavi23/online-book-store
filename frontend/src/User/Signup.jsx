import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const API = '/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/user/signup`, form);
      toast.success('Account created successfully! Please log in. 🎉');
      navigate('/user/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      toast.error(msg);
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
          <p>Create your reader account</p>
        </div>
        <h2 className="auth-title">Join BookStore</h2>
        <p className="auth-subtitle">Start your reading journey today</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" name="phone" className="form-input" placeholder="Phone number" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input type={showPw ? 'text' : 'password'} name="password" className="form-input" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required style={{ paddingRight: '3rem' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '2.4rem', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/user/login">Sign in</Link>
          <br /><br />
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const API = '/api';

export default function Asignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/admin/signup`, form);
      toast.success('Admin account created successfully! Please log in. 🎉');
      navigate('/admin/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🔧</span>
          <h1>BookStore</h1>
          <p>Create Admin Account</p>
        </div>
        <h2 className="auth-title">Register Admin</h2>
        <p className="auth-subtitle">Add a new administrator to the system</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Admin Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="admin@bookstore.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Password</label>
            <input type={showPw ? 'text' : 'password'} className="form-input" placeholder="At least 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingRight: '3rem' }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '2.4rem', background: 'none', color: 'var(--text-muted)', padding: 0 }}>
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Creating...' : 'Register Admin'}
          </button>
        </form>
        <div className="auth-footer">
          Already registered? <Link to="/admin/login">Sign in</Link>
          <br /><br />
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Snavbar from './Snavbar';
import { BookOpen, ShoppingBag, DollarSign, TrendingUp, Package, CheckCircle } from 'lucide-react';

const API = '/api';

export default function Shome() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({ totalBooks: 0, totalOrders: 0, totalRevenue: 0, delivered: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/sellers/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
    } catch {}
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/seller`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data.slice(0, 5));
    } catch {}
    finally { setLoading(false); }
  };

  const statCards = [
    { label: 'Total Books', value: stats.totalBooks, icon: <BookOpen size={22} />, color: 'rgba(99,102,241,0.2)', iconColor: '#818cf8' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <Package size={22} />, color: 'rgba(245,158,11,0.2)', iconColor: '#f59e0b' },
    { label: 'Revenue (₹)', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={22} />, color: 'rgba(16,185,129,0.2)', iconColor: '#10b981' },
    { label: 'Delivered', value: stats.delivered, icon: <CheckCircle size={22} />, color: 'rgba(59,130,246,0.2)', iconColor: '#3b82f6' },
  ];

  const STATUS_COLORS = {
    Placed: '#3b82f6', Confirmed: '#818cf8', Processing: '#f59e0b',
    Shipped: '#f59e0b', Delivered: '#10b981', Cancelled: '#ef4444'
  };

  return (
    <div className="dashboard-layout">
      <Snavbar />
      <main className="dashboard-content">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>
            Welcome back, <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.name}!</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your store today.</p>
          {!user?.approved && (
            <div style={{ marginTop: '1rem', padding: '0.85rem 1.25rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-md)', color: '#f59e0b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⏳ Your store is pending admin approval. You can add books, but orders will be enabled once approved.
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Recent Orders</h2>
          {loading ? (
            <div className="loading-wrapper"><div className="spinner" /></div>
          ) : orders.length === 0 ? (
            <div className="empty-state" style={{ padding: '2.5rem' }}>
              <div className="empty-icon">📦</div>
              <h3>No orders yet</h3>
              <p>Orders will appear here once customers buy your books.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td>{o.user?.name || '—'}</td>
                      <td>{o.items.length} book(s)</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{o.totalAmount}</td>
                      <td>
                        <span style={{ padding: '0.25rem 0.7rem', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600, background: STATUS_COLORS[o.orderStatus] + '22', color: STATUS_COLORS[o.orderStatus] }}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

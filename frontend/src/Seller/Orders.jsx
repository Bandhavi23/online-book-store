import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Snavbar from './Snavbar';
import { ShoppingBag, ChevronDown } from 'lucide-react';

const API = '/api';
const STATUS_OPTIONS = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Placed: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  Confirmed: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  Processing: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Shipped: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Delivered: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  Cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/seller`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/orders/${orderId}/status`, { orderStatus: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="dashboard-layout">
      <Snavbar />
      <main className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={26} /> Orders Received
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and update your order statuses</p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['All', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '0.4rem 1rem', borderRadius: 50, border: '1.5px solid',
              borderColor: filter === s ? (STATUS_COLORS[s]?.color || 'var(--primary)') : 'var(--border)',
              background: filter === s ? ((STATUS_COLORS[s]?.bg) || 'rgba(99,102,241,0.15)') : 'transparent',
              color: filter === s ? (STATUS_COLORS[s]?.color || 'var(--primary-light)') : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition-fast)', fontFamily: 'Inter, sans-serif'
            }}>
              {s} {s !== 'All' && `(${orders.filter(o => o.orderStatus === s).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No {filter === 'All' ? '' : filter.toLowerCase()} orders</h3>
            <p>Orders will appear here when customers purchase your books.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(order => {
              const badge = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.Placed;
              return (
                <div key={order._id} className="glass-card" style={{ padding: '1.5rem', transition: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        Customer: <strong style={{ color: 'var(--text-primary)' }}>{order.user?.name || '—'}</strong>
                        {' '}• {order.user?.email}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.1rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ padding: '0.3rem 0.9rem', borderRadius: 50, background: badge.bg, color: badge.color, fontSize: '0.78rem', fontWeight: 600 }}>
                        {order.orderStatus}
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Order items */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {item.image
                            ? <img src={item.image} alt={item.title} style={{ width: 36, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                            : <div style={{ width: 36, height: 48, background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📚</div>
                          }
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.title}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--accent)', whiteSpace: 'nowrap' }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Payment: {order.paymentMethod}</span>
                    <strong style={{ color: 'var(--accent)', fontSize: '1rem' }}>Total: ₹{order.totalAmount}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Package, ArrowLeft } from 'lucide-react';
import OrderItem from './OrderItem';

const API = '/api';

const STATUS_COLORS = {
  Placed: 'badge-info', Confirmed: 'badge-primary', Processing: 'badge-warning',
  Shipped: 'badge-warning', Delivered: 'badge-success', Cancelled: 'badge-danger'
};

export default function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/my`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const cancelOrder = async (id) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await axios.put(`${API}/orders/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel order'); }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/user/home" className="navbar-brand"><span className="brand-icon">📚</span> BookStore</Link>
          <ul className="navbar-links">
            <li><Link to="/user/home">Home</Link></li>
            <li><Link to="/user/products">Browse</Link></li>
            <li><Link to="/user/orders" className="active">My Orders</Link></li>
          </ul>
          <Link to="/user/home" className="btn btn-outline btn-sm"><ArrowLeft size={14} /> Back</Link>
        </div>
      </nav>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Package size={28} /> My Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your book orders</p>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><span>Loading orders...</span></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Browse our collection and place your first order!</p>
            <Link to="/user/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Books</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map(order => (
              <OrderItem key={order._id} order={order} onCancel={cancelOrder} statusColors={STATUS_COLORS} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

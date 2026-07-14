import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Anavbar from './Anavbar';
import { ShieldAlert, Check, Ban, Trash2, Search } from 'lucide-react';

const API = '/api';

export default function Seller() {
  const { token } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await axios.get(`${API}/admin/sellers`, { headers: { Authorization: `Bearer ${token}` } });
      setSellers(res.data);
    } catch {
      toast.error('Failed to load sellers list');
    } finally {
      setLoading(false);
    }
  };

  const toggleApprove = async (id, currentStatus) => {
    try {
      const res = await axios.put(`${API}/admin/sellers/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message || `Seller status updated`);
      setSellers(sellers.map(s => s._id === id ? { ...s, approved: !currentStatus } : s));
    } catch {
      toast.error('Failed to change approval status');
    }
  };

  const toggleBlock = async (id, currentStatus) => {
    try {
      const res = await axios.put(`${API}/admin/sellers/${id}/block`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.message || `Seller status updated`);
      setSellers(sellers.map(s => s._id === id ? { ...s, blocked: !currentStatus } : s));
    } catch {
      toast.error('Failed to update block status');
    }
  };

  const deleteSeller = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this seller store? All listed books under this seller might be affected.')) return;
    try {
      await axios.delete(`${API}/admin/sellers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Seller deleted successfully');
      setSellers(sellers.filter(s => s._id !== id));
    } catch {
      toast.error('Failed to delete seller');
    }
  };

  const filteredSellers = sellers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.storeName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Anavbar />
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Sellers</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Verify new stores, approve catalog listings, or block violators</p>
          </div>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search sellers or stores..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          </div>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><span>Loading sellers list...</span></div>
        ) : filteredSellers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No sellers found</h3>
            <p>We couldn't find any stores matching your query.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Store Details</th>
                  <th>Contact Email</th>
                  <th>Contact Phone</th>
                  <th>Approval Status</th>
                  <th>Block Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.storeName}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Owner: {s.name}</div>
                    </td>
                    <td>{s.email}</td>
                    <td>{s.phone || '—'}</td>
                    <td>
                      <button
                        onClick={() => toggleApprove(s._id, s.approved)}
                        className={`btn btn-sm ${s.approved ? 'btn-success' : 'btn-outline'}`}
                        style={{ padding: '0.3rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem' }}
                      >
                        {s.approved ? 'Approved' : 'Pending Approval'}
                      </button>
                    </td>
                    <td>
                      <span className={`badge ${s.blocked ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.75rem' }}>
                        {s.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => toggleBlock(s._id, s.blocked)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--warning)', color: 'var(--warning)', padding: '0.4rem' }}
                          title={s.blocked ? "Unblock Seller" : "Block Seller"}
                        >
                          <Ban size={15} />
                        </button>
                        <button
                          onClick={() => deleteSeller(s._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.4rem' }}
                          title="Delete Store"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

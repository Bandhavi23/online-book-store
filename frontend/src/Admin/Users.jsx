import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Anavbar from './Anavbar';
import { Trash2, Search } from 'lucide-react';

const API = '/api';

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      await axios.delete(`${API}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== id));
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Anavbar />
      <main className="dashboard-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Manage Users</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor registered customer accounts</p>
          </div>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
          </div>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /><span>Loading users list...</span></div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>We couldn't find any user profiles matching your criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', marginTop: '0.15rem' }}>Reader</span>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || '—'}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.address}>
                      {u.address || '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)} style={{ display: 'inline-flex', padding: '0.4rem' }} title="Delete Account">
                        <Trash2 size={15} />
                      </button>
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

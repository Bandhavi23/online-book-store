import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookPlus, BookOpen, ShoppingBag, LogOut, Store } from 'lucide-react';

const links = [
  { to: '/seller/home', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/seller/add-book', label: 'Add Book', icon: <BookPlus size={18} /> },
  { to: '/seller/products', label: 'My Products', icon: <BookOpen size={18} /> },
  { to: '/seller/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
];

export default function Snavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Store size={20} style={{ color: '#f59e0b' }} /> Seller Panel
      </div>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.1rem' }}>{user?.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user?.storeName}</div>
        <div style={{ marginTop: '0.5rem' }}>
          <span className={`badge ${user?.approved ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
            {user?.approved ? '✓ Approved' : '⏳ Pending Approval'}
          </span>
        </div>
      </div>
      <nav style={{ flex: 1 }}>
        <ul className="sidebar-nav">
          {links.map(l => (
            <li key={l.to}>
              <Link to={l.to} className={location.pathname === l.to ? 'active' : ''}>
                {l.icon} {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ padding: '1rem' }}>
        <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => { logout(); navigate('/'); }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

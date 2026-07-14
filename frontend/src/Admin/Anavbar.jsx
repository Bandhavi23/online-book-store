import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Store, BookOpen, LogOut, Shield } from 'lucide-react';

const links = [
  { to: '/admin/home', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/admin/users', label: 'Manage Users', icon: <Users size={18} /> },
  { to: '/admin/sellers', label: 'Manage Sellers', icon: <Store size={18} /> },
  { to: '/admin/books', label: 'Manage Books', icon: <BookOpen size={18} /> },
];

export default function Anavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Shield size={20} style={{ color: '#6366f1' }} /> Admin Panel
      </div>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.1rem' }}>{user?.name}</div>
        <div style={{ color: 'var(--primary-light)', fontSize: '0.8rem', fontWeight: 600 }}>System Administrator</div>
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

import { Link } from 'react-router-dom';
import { BookOpen, Globe, Shield, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'rgba(13,18,48,0.8)', padding: '3rem 0 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              <BookOpen size={22} style={{ color: '#6366f1' }} />
              BookStore
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Your one-stop destination for all things books. Discover, explore, and enjoy reading like never before.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[Globe, BookOpen, Shield, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary-light)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['Home', '/'], ['Browse Books', '/user/products'], ['User Login', '/user/login'], ['Seller Login', '/seller/login'], ['Admin Login', '/admin/login']].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'var(--transition-fast)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Top Genres</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {['Fiction', 'Non-Fiction', 'Science', 'Romance', 'Biography', 'Fantasy'].map(g => (
                <li key={g}>
                  <Link to="/user/products" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'var(--transition-fast)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>📧 support@bookstore.com</span>
              <span>📞 +91 98765 43210</span>
              <span>📍 Hyderabad, India</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© 2024 BookStore. All rights reserved. Built with ❤️ by Team BookStore.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', transition: 'var(--transition-fast)' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary-light)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, ShoppingBag, Star, ArrowRight, Sparkles, Globe, Shield } from 'lucide-react';
import Footer from './Footer';

const GENRES = ['Fiction', 'Non-Fiction', 'Science', 'Romance', 'Mystery', 'Thriller', 'Biography', 'Children', 'Fantasy', 'History', 'Self-Help', 'Technology'];

const GENRE_ICONS = {
  Fiction: '📖', 'Non-Fiction': '📚', Science: '🔬', Romance: '💕',
  Mystery: '🔍', Thriller: '😱', Biography: '👤', Children: '🧒',
  Fantasy: '🧙', History: '🏛️', 'Self-Help': '💡', Technology: '💻'
};

const features = [
  { icon: <BookOpen size={28} />, title: 'Vast Collection', desc: 'Over 10,000 titles across every genre, author, and language — always expanding.', color: 'rgba(99, 102, 241, 0.2)' },
  { icon: <Star size={28} />, title: 'Trusted Reviews', desc: 'Real reviews from verified readers to guide your next great pick.', color: 'rgba(245, 158, 11, 0.2)' },
  { icon: <ShoppingBag size={28} />, title: 'Easy Shopping', desc: 'Seamless cart, quick checkout, and real-time order tracking.', color: 'rgba(16, 185, 129, 0.2)' },
  { icon: <Globe size={28} />, title: 'Any Device', desc: 'Fully responsive on desktop, tablet, and mobile — read anytime, anywhere.', color: 'rgba(239, 68, 68, 0.2)' },
  { icon: <Sparkles size={28} />, title: 'Recommendations', desc: 'Personalized book suggestions tailored to your reading preferences.', color: 'rgba(139, 92, 246, 0.2)' },
  { icon: <Shield size={28} />, title: 'Secure Platform', desc: 'Your data and payments are protected with industry-standard security.', color: 'rgba(59, 130, 246, 0.2)' },
];

const stats = [
  { value: '10K+', label: 'Books Available' },
  { value: '5K+', label: 'Happy Readers' },
  { value: '200+', label: 'Sellers & Publishers' },
  { value: '50+', label: 'Genres Covered' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <span className="brand-icon">📚</span>
            BookStore
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/user/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/user/signup" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div
          className="hero-bg-orb"
          style={{ width: 600, height: 600, background: 'var(--primary)', top: -200, right: -200 }}
        />
        <div
          className="hero-bg-orb"
          style={{ width: 400, height: 400, background: 'var(--accent)', bottom: -100, left: -100, animationDelay: '3s' }}
        />
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="hero-content fade-in">
            <div className="hero-badge">
              <Sparkles size={14} />
              Your One-Stop Book Destination
            </div>
            <h1>
              Discover Your Next<br />
              <span className="gradient-text">Favourite Book</span>
            </h1>
            <p>
              Whether you're a passionate reader or searching for the perfect gift,
              BookStore brings thousands of titles to your fingertips — with seamless
              browsing, personalized recommendations, and secure checkout.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/user/signup')}>
                Start Exploring <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/seller/signup')}>
                Sell Your Books
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(99,102,241,0.04)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Playfair Display, serif', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Genre ── */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Browse by Genre</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Explore books across every category imaginable</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => navigate('/user/products')}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 0.75rem',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{GENRE_ICONS[g]}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{g}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section-pad" style={{ background: 'rgba(99,102,241,0.03)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Why Choose BookStore?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              We built this platform to make reading more accessible, enjoyable, and social.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ padding: '1.75rem' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portals CTA ── */}
      <section className="section-pad">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Get Started Today</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Choose your role and join the BookStore community</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { emoji: '🛍️', title: 'I\'m a Reader', desc: 'Browse thousands of books, place orders, and track deliveries.', color: 'var(--primary)', loginPath: '/user/login', signupPath: '/user/signup' },
              { emoji: '📦', title: 'I\'m a Seller', desc: 'List your books, manage inventory, and fulfill orders effortlessly.', color: 'var(--accent)', loginPath: '/seller/login', signupPath: '/seller/signup' },
              { emoji: '🔧', title: 'I\'m an Admin', desc: 'Manage the platform, approve sellers, and oversee all activity.', color: 'var(--success)', loginPath: '/admin/login', signupPath: '/admin/signup' },
            ].map((p, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{p.emoji}</div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{p.desc}</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <Link to={p.loginPath} className="btn btn-outline btn-sm">Login</Link>
                  <Link to={p.signupPath} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: p.color, color: 'white', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>Sign Up</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

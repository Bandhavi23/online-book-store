import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Anavbar from './Anavbar';
import { 
  Users as UsersIcon, 
  Store, 
  BookOpen, 
  ShoppingBag, 
  DollarSign, 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

const API = '/api';

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#84cc16', // Lime
  '#a855f7'  // Purple
];

const STATUS_COLORS = {
  Placed: '#818cf8',      // Soft Indigo
  Confirmed: '#38bdf8',   // Sky Blue
  Processing: '#fbbf24',  // Amber
  Shipped: '#a78bfa',     // Purple
  Delivered: '#34d399',   // Emerald
  Cancelled: '#f87171'    // Rose Red
};

export default function Ahome() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    booksByGenre: [],
    salesOverTime: [],
    ordersByStatus: [],
    sellerStats: { approved: 0, pending: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Readers', value: stats.totalUsers, icon: <UsersIcon size={22} />, color: 'rgba(99,102,241,0.15)', iconColor: '#818cf8' },
    { label: 'Registered Sellers', value: stats.totalSellers, icon: <Store size={22} />, color: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b' },
    { label: 'Books Catalogued', value: stats.totalBooks, icon: <BookOpen size={22} />, color: 'rgba(16,185,129,0.15)', iconColor: '#10b981' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={22} />, color: 'rgba(239,68,68,0.15)', iconColor: '#ef4444' },
    { label: 'Sales Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={22} />, color: 'rgba(139,92,246,0.15)', iconColor: '#a78bfa' },
  ];

  // ── SALES OVER TIME (Bar Chart / Histogram Calculations) ──
  const maxRevenue = Math.max(...stats.salesOverTime.map(s => s.revenue), 1000);
  const svgWidth = 550;
  const svgHeight = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // ── BOOKS BY GENRE (Donut Chart Calculations) ──
  const totalGenreBooks = stats.booksByGenre.reduce((sum, item) => sum + item.count, 0) || 1;
  const r = 50;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * r;
  let accumulatedOffset = 0;

  const donutSlices = stats.booksByGenre.map((item, idx) => {
    const percentage = item.count / totalGenreBooks;
    const strokeLength = percentage * circumference;
    const offset = accumulatedOffset;
    accumulatedOffset += strokeLength;
    return {
      label: item._id,
      count: item.count,
      percentage: (percentage * 100).toFixed(1),
      strokeDasharray: `${strokeLength} ${circumference}`,
      strokeDashoffset: -offset,
      color: COLORS[idx % COLORS.length]
    };
  });

  // ── ORDER STATUS (Horizontal Histogram Progress Bars) ──
  const totalOrdersCount = stats.ordersByStatus.reduce((sum, item) => sum + item.count, 0) || 1;

  return (
    <div className="dashboard-layout">
      <Anavbar />
      <main className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
            System Analytics Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Welcome, Admin {user?.name}. Monitor real-time sales transactions, inventory distributions, and user trends.
          </p>
        </div>

        {loading ? (
          <div className="loading-wrapper"><div className="spinner" /></div>
        ) : (
          <>
            {/* ── Key Metrics grid ── */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {statCards.map((s, i) => (
                <div key={i} className="stat-card" style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="stat-icon" style={{ background: s.color, color: s.iconColor, width: '42px', height: '42px', borderRadius: '10px' }}>{s.icon}</div>
                  <div className="stat-value" style={{ fontSize: '1.35rem', marginTop: '0.75rem' }}>{s.value}</div>
                  <div className="stat-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── CHARTS ROW ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              
              {/* Chart 1: Sales Revenue Trend (Bar Graph/Histogram) */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                  <TrendingUp size={18} style={{ color: '#818cf8' }} /> Sales Revenue Trend (Last 10 Days)
                </h2>
                
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ overflow: 'visible' }}>
                    {/* Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                      const yPos = padding.top + graphHeight * (1 - ratio);
                      const value = Math.round(maxRevenue * ratio);
                      return (
                        <g key={idx}>
                          <line 
                            x1={padding.left} 
                            y1={yPos} 
                            x2={svgWidth - padding.right} 
                            y2={yPos} 
                            stroke="rgba(255,255,255,0.05)" 
                            strokeDasharray="4"
                          />
                          <text 
                            x={padding.left - 10} 
                            y={yPos + 4} 
                            fill="var(--text-muted)" 
                            fontSize="10" 
                            textAnchor="end"
                          >
                            ₹{value}
                          </text>
                        </g>
                      );
                    })}

                    {/* Bars */}
                    {stats.salesOverTime.map((item, idx) => {
                      const barWidth = 24;
                      const gap = (graphWidth - (stats.salesOverTime.length * barWidth)) / (stats.salesOverTime.length - 1);
                      const x = padding.left + idx * (barWidth + gap);
                      const barHeight = (item.revenue / maxRevenue) * graphHeight;
                      const y = padding.top + graphHeight - barHeight;

                      const dateObj = new Date(item.date);
                      const labelStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

                      return (
                        <g key={idx}>
                          {/* Interactive Bar */}
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={Math.max(barHeight, 2)}
                            rx={3}
                            fill={hoveredBar === idx ? '#a78bfa' : 'url(#barGrad)'}
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                            onMouseEnter={() => setHoveredBar(idx)}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                          {/* Label */}
                          {idx % 2 === 0 && (
                            <text
                              x={x + barWidth/2}
                              y={svgHeight - 12}
                              fill="var(--text-muted)"
                              fontSize="9.5"
                              textAnchor="middle"
                            >
                              {labelStr}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Tooltip Overlay */}
                  {hoveredBar !== null && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#131940',
                      border: '1px solid rgba(129, 140, 248, 0.4)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(stats.salesOverTime[hoveredBar].date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#818cf8', marginTop: '2px' }}>
                        Revenue: ₹{stats.salesOverTime[hoveredBar].revenue.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Orders: {stats.salesOverTime[hoveredBar].orders}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart 2: Books by Genre Distribution (Donut Pie Chart) */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                  <PieIcon size={18} style={{ color: '#10b981' }} /> Books Genre Distribution
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', flex: 1 }}>
                  {/* SVG Donut */}
                  <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      {donutSlices.map((slice, idx) => (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth="15"
                          strokeDasharray={slice.strokeDasharray}
                          strokeDashoffset={slice.strokeDashoffset}
                          transform="rotate(-90 80 80)"
                          style={{ 
                            transition: 'stroke-width 0.2s ease, opacity 0.2s', 
                            cursor: 'pointer',
                            opacity: hoveredSlice === null || hoveredSlice === idx ? 1 : 0.65
                          }}
                          onMouseEnter={() => setHoveredSlice(idx)}
                          onMouseLeave={() => setHoveredSlice(null)}
                        />
                      ))}
                    </svg>

                    {/* Central Total Info */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'Outfit' }}>{totalGenreBooks}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Books</div>
                    </div>
                  </div>

                  {/* Legend Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '0.5rem 1rem', 
                    fontSize: '0.75rem', 
                    maxHeight: '160px', 
                    overflowY: 'auto',
                    flex: 1,
                    paddingRight: '4px'
                  }}>
                    {donutSlices.map((slice, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.4rem',
                          color: hoveredSlice === idx ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: hoveredSlice === idx ? 'bold' : 'normal'
                        }}
                        onMouseEnter={() => setHoveredSlice(idx)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      >
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: slice.color }} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '85px' }}>{slice.label}</span>
                        <span style={{ color: 'var(--text-muted)' }}>({slice.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donut Slice Info Box */}
                {hoveredSlice !== null && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '0.8rem'
                  }}>
                    <strong style={{ color: donutSlices[hoveredSlice].color }}>{donutSlices[hoveredSlice].label}</strong>: {donutSlices[hoveredSlice].count} books ({donutSlices[hoveredSlice].percentage}%)
                  </div>
                )}
              </div>

            </div>

            {/* ── LOWER ROW: STATUS HISTOGRAM & SELLER VERIFICATION ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              
              {/* Order Status Distribution Histogram */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                  <Clock size={18} style={{ color: '#a78bfa' }} /> Order Status Distribution
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '0.5rem' }}>
                  {Object.keys(STATUS_COLORS).map((status, idx) => {
                    const match = stats.ordersByStatus.find(o => o._id === status);
                    const count = match ? match.count : 0;
                    const percent = ((count / totalOrdersCount) * 100).toFixed(0);
                    const color = STATUS_COLORS[status];

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                            {status}
                          </span>
                          <span style={{ fontWeight: 'bold' }}>{count} ({percent}%)</span>
                        </div>
                        {/* Progress Bar container */}
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${percent}%`, 
                              height: '100%', 
                              background: color, 
                              borderRadius: '4px',
                              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seller Approval Status Overview */}
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                    <Store size={18} style={{ color: '#f59e0b' }} /> Bookstores verification status
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Monitor registered bookstores awaiting moderator approval or currently active.
                  </p>

                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', margin: '1rem 0' }}>
                    {/* Approved Circle */}
                    <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '12px' }}>
                      <CheckCircle2 size={24} style={{ color: '#10b981', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.sellerStats.approved}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Approved Stores</div>
                    </div>

                    {/* Pending Circle */}
                    <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '12px' }}>
                      <AlertCircle size={24} style={{ color: '#f59e0b', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.sellerStats.pending}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending Moderation</div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  💡 Pending seller registration requests can be approved immediately from the <strong>Sellers Panel</strong> on the sidebar.
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}

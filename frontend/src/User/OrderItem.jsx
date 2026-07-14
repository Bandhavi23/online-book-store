import { Package } from 'lucide-react';

const STATUS_STEPS = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const STATUS_BADGE = {
  Placed: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  Confirmed: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  Processing: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Shipped: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  Delivered: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  Cancelled: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
};

export default function OrderItem({ order, onCancel }) {
  const badge = STATUS_BADGE[order.orderStatus] || STATUS_BADGE.Placed;
  const stepIndex = STATUS_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="glass-card" style={{ padding: '1.5rem', transition: 'none' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <Package size={18} style={{ color: 'var(--primary-light)' }} />
            <span style={{ fontWeight: 700, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' }}>Order #{order._id.slice(-8).toUpperCase()}</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ padding: '0.3rem 0.9rem', borderRadius: 50, background: badge.bg, color: badge.color, fontSize: '0.78rem', fontWeight: 600 }}>
            {order.orderStatus}
          </span>
          {!isCancelled && !['Shipped', 'Delivered'].includes(order.orderStatus) && (
            <button onClick={() => onCancel(order._id)} style={{ padding: '0.3rem 0.75rem', borderRadius: 6, border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', fontSize: '0.78rem', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Progress Tracker */}
      {!isCancelled && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: i <= stepIndex ? 'var(--primary)' : 'var(--bg-card)', border: `2px solid ${i <= stepIndex ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', fontSize: '0.7rem', color: i <= stepIndex ? 'white' : 'var(--text-muted)', fontWeight: 700, transition: 'all 0.3s' }}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: i <= stepIndex ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: i === stepIndex ? 600 : 400 }}>{step}</div>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < stepIndex ? 'var(--primary)' : 'var(--border)', margin: '0 4px', marginBottom: 20, transition: 'all 0.3s' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {item.image
              ? <img src={item.image} alt={item.title} style={{ width: 45, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
              : <div style={{ width: 45, height: 60, background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>📚</div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{item.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Qty: {item.quantity} × ₹{item.price}</div>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{item.price * item.quantity}</div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Payment: {order.paymentMethod}</span>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>Total: ₹{order.totalAmount}</span>
      </div>
    </div>
  );
}

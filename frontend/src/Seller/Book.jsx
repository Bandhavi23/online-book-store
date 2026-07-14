import { Star, Edit, Trash2 } from 'lucide-react';

export default function Book({ book, onDelete, onEdit }) {
  const discount = book.originalPrice > book.price
    ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

  return (
    <div className="book-card" style={{ position: 'relative' }}>
      {book.featured && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: 'var(--accent)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 50, fontSize: '0.7rem', fontWeight: 700 }}>
          ⭐ Featured
        </div>
      )}
      {book.image
        ? <img src={book.image} alt={book.title} className="book-card-image" />
        : <div className="book-card-placeholder">📚</div>
      }
      <div className="book-card-body">
        <span className="book-genre-badge">{book.genre}</span>
        <div className="book-title">{book.title}</div>
        <div className="book-author">by {book.author}</div>
        {book.rating > 0 && (
          <div className="book-rating"><Star size={12} fill="currentColor" />{book.rating.toFixed(1)}</div>
        )}
        <div className="book-price" style={{ marginBottom: '0.5rem' }}>
          <span className="price-current">₹{book.price}</span>
          {book.originalPrice > book.price && <span className="price-original">₹{book.originalPrice}</span>}
          {discount > 0 && <span className="price-discount">{discount}% off</span>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: book.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
            {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{book.numReviews} reviews</span>
        </div>
      </div>
      <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn btn-outline btn-sm" onClick={() => onEdit(book)} style={{ flex: 1, justifyContent: 'center' }}>
          <Edit size={14} /> Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(book._id)} style={{ flex: 1, justifyContent: 'center' }}>
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}

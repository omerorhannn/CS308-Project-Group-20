import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { items, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [displayItems, setDisplayItems] = useState([]);
  const [removed, setRemoved] = useState({});

  useEffect(() => {
    setDisplayItems((prev) => {
      const existingIds = prev.map((p) => p.id);
      const newItems = items.filter((p) => !existingIds.includes(p.id));
      return [...prev, ...newItems];
    });
  }, [items]);

  const handleToggle = (item) => {
    const isRemoved = removed[item.id];
    setRemoved((prev) => ({ ...prev, [item.id]: !isRemoved }));
    if (isRemoved) addToWishlist(item);
    else removeFromWishlist(item.id);
  };

  if (displayItems.length === 0) {
    return (
      <section className="cart-page section">
        <div className="container">
          <div className="empty-state">
            <i className="fas fa-heart" />
            <h3>Your wishlist is empty</h3>
            <p>Save products you love to your wishlist.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
              <i className="fas fa-arrow-left" /> <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const activeCount = displayItems.filter((p) => !removed[p.id]).length;

  return (
    <section className="cart-page section">
      <div className="container">
        <div className="cart-header">
          <h2 className="section-title">Wishlist</h2>
          <p className="section-sub">{activeCount} item{activeCount !== 1 ? 's' : ''} saved</p>
        </div>

        <div className="cart-items">
          {displayItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img src={item.img} alt={item.name} loading="lazy" />
              </div>
              <div className="cart-item-details">
                <span className="product-brand">{item.brand}</span>
                <h3 className="product-name">
                  <Link to={`/product/${item.id}`} className="product-name-link">{item.name}</Link>
                </h3>
                <span className="price-current">{item.priceDisplay}</span>
              </div>
              <div className="cart-item-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                >
                  <i className="fas fa-shopping-bag" /> Add to Cart
                </button>
                <button
                  className={`wishlist-btn${removed[item.id] ? '' : ' active'}`}
                  onClick={() => handleToggle(item)}
                  aria-label={`Remove ${item.name} from wishlist`}
                  style={{ position: 'relative', top: 'auto', right: 'auto' }}
                >
                  <i className={`${removed[item.id] ? 'far' : 'fas'} fa-heart`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link to="/" className="cart-continue-link" style={{ marginTop: '24px', display: 'inline-flex' }}>
          <i className="fas fa-arrow-left" /> Continue Shopping
        </Link>
      </div>
    </section>
  );
}

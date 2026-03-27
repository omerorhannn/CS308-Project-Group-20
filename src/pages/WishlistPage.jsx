import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
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

  return (
    <section className="cart-page section">
      <div className="container">
        <div className="cart-header">
          <h2 className="section-title">Wishlist</h2>
          <p className="section-sub">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
        </div>

        <div className="cart-items">
          {items.map((item) => (
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
                  className="cart-remove-btn"
                  onClick={() => toggleWishlist(item)}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <i className="fas fa-trash-alt" />
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

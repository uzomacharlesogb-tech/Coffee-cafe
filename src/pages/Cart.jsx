import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const deliveryFee = cartItems.length > 0 ? 1500 : 0;
  const total = cartTotal + deliveryFee;

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <section className="empty-cart">
          <p className="eyebrow">Cafe Street</p>

          <h1>Your Cart is Empty</h1>

          <p>Looks like you haven't added any coffee yet.</p>

          <Link to="/menu" className="primary-button">
            Browse Menu
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-header">
        <p className="eyebrow">Cafe Street</p>

        <h1>Your Cart</h1>

        <p>Review your coffee selection before checking out.</p>
      </section>

      <section className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <span>{item.image}</span>
              </div>

              <div className="cart-item-info">
                <p className="product-category">{item.category}</p>

                <h2>{item.name}</h2>

                <strong>{formatPrice(item.price)}</strong>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong>{formatPrice(deliveryFee)}</strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-row summary-total">
            <span>Total</span>

            <strong>{formatPrice(total)}</strong>
          </div>

          <Link to="/checkout" className="primary-button checkout-button">
            Proceed to Checkout
          </Link>

          <Link to="/menu" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </aside>
      </section>
    </main>
  );
}

export default Cart;

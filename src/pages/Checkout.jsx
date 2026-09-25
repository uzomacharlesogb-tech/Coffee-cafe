import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    city: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryFee = deliveryMethod === "delivery" ? 1500 : 0;

  const total = cartTotal + deliveryFee;

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      return;
    }

    if (!formData.phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (deliveryMethod === "delivery" && !formData.address) {
      setError("Please enter your delivery address.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create the order in Firestore first.
      const order = {
        userId: user.uid,
        customer: user.displayName || "Cafe Street Customer",
        email: user.email,

        items: cartItems,

        deliveryMethod,
        deliveryFee,

        subtotal: cartTotal,
        total,

        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        note: formData.note,

        status: "Awaiting Payment",
        paymentStatus: "Pending",
      };

      const orderId = await createOrder(order);

      console.log("Order created:", orderId);

      // 2. Ask our backend to initialize Paystack.
      const response = await fetch(
        "http://localhost:5000/api/payment/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            amount: total,
            orderId,
          }),
        },
      );

      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(
          paymentData.message || "Payment initialization failed.",
        );
      }

      console.log("Paystack payment initialized:", paymentData);

      // 3. Send the customer to Paystack.
      window.location.href = paymentData.authorizationUrl;
    } catch (err) {
      console.error("Checkout payment error:", err);

      setError(
        err.message || "We couldn't start your payment. Please try again.",
      );

      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <section className="empty-cart">
          <p className="eyebrow">Cafe Street</p>

          <h1>Your cart is empty</h1>

          <p>Add some coffee to your cart before checking out.</p>

          <Link to="/menu" className="primary-button">
            Browse Menu
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <p className="eyebrow">Cafe Street</p>

        <h1>Checkout</h1>

        <p>Complete your order and we'll get your coffee ready.</p>
      </section>

      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}

          <div className="checkout-section">
            <h2>Contact Information</h2>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="08012345678"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Order Type</h2>

            <div className="delivery-options">
              <button
                type="button"
                className={
                  deliveryMethod === "delivery"
                    ? "delivery-option active"
                    : "delivery-option"
                }
                onClick={() => setDeliveryMethod("delivery")}
              >
                <strong>Delivery</strong>
                <span>₦1,500</span>
              </button>

              <button
                type="button"
                className={
                  deliveryMethod === "pickup"
                    ? "delivery-option active"
                    : "delivery-option"
                }
                onClick={() => setDeliveryMethod("pickup")}
              >
                <strong>Pickup</strong>
                <span>Free</span>
              </button>
            </div>
          </div>

          {deliveryMethod === "delivery" && (
            <div className="checkout-section">
              <h2>Delivery Address</h2>

              <div className="form-group">
                <label htmlFor="address">Address</label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter your delivery address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="checkout-section">
            <h2>Order Note</h2>

            <div className="form-group">
              <label htmlFor="note">Note (optional)</label>

              <textarea
                id="note"
                name="note"
                placeholder="Anything we should know about your order?"
                value={formData.note}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-button checkout-submit"
            disabled={loading}
          >
            {loading
              ? "Connecting to Paystack..."
              : `Pay Now — ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Your Order</h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>

                  <span>
                    {item.quantity} × {formatPrice(item.price)}
                  </span>
                </div>

                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

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
        </aside>
      </section>
    </main>
  );
}

export default Checkout;

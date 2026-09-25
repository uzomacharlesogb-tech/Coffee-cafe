import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserOrders, cancelOrder } from "../services/orderService";

function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const userOrders = await getUserOrders(user.uid);

        setOrders(userOrders);
      } catch (err) {
        console.error("Error loading orders:", err);

        setError("Unable to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "Cancelled",
              }
            : order,
        ),
      );
    } catch (err) {
      console.error("Error cancelling order:", err);

      setError("Unable to cancel this order. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="orders-page">
        <section className="empty-orders">
          <p className="eyebrow">Cafe Street</p>

          <h1>My Orders</h1>

          <p>Loading your orders...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <section className="empty-orders">
          <p className="eyebrow">Cafe Street</p>

          <h1>My Orders</h1>

          <p>{error}</p>

          <Link to="/menu" className="primary-button">
            Back to Menu
          </Link>
        </section>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <section className="empty-orders">
          <p className="eyebrow">Cafe Street</p>

          <h1>My Orders</h1>

          <p>You haven't placed any orders yet.</p>

          <Link to="/menu" className="primary-button">
            Browse Menu
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <section className="orders-header">
        <p className="eyebrow">Cafe Street</p>

        <h1>My Orders</h1>

        <p>View and manage your previous coffee orders.</p>
      </section>

      <section className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-card-header">
              <div>
                <p>Order</p>

                <h2>{order.id}</h2>
              </div>

              <span
                className={`order-status order-status-${order.status.toLowerCase()}`}
              >
                {order.status}
              </span>
            </div>

            <div className="order-date">{formatDate(order.createdAt)}</div>

            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item.id}>
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

            <div className="order-details">
              <div>
                <span>Order type</span>

                <strong>
                  {order.deliveryMethod === "delivery" ? "Delivery" : "Pickup"}
                </strong>
              </div>

              {order.deliveryMethod === "delivery" && (
                <div>
                  <span>Address</span>

                  <strong>
                    {order.address}
                    {order.city ? `, ${order.city}` : ""}
                  </strong>
                </div>
              )}

              <div>
                <span>Phone</span>

                <strong>{order.phone}</strong>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="order-total">
              <span>Total</span>

              <strong>{formatPrice(order.total)}</strong>
            </div>

            {order.status === "Pending" && (
              <button
                type="button"
                className="cancel-order-button"
                onClick={() => handleCancelOrder(order.id)}
              >
                Cancel Order
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}

export default Orders;

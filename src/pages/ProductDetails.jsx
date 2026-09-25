import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  if (!product) {
    return (
      <main className="product-details-page">
        <section className="product-not-found">
          <p className="eyebrow">Cafe Street</p>

          <h1>Product not found</h1>

          <p>Sorry, we couldn't find the coffee you're looking for.</p>

          <Link to="/menu" className="primary-button">
            Back to Menu
          </Link>
        </section>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <main className="product-details-page">
      <section className="product-details">
        <div className="product-details-image">
          <span>{product.image}</span>
        </div>

        <div className="product-details-content">
          <p className="eyebrow">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-details-description">{product.description}</p>

          <div className="product-details-price">
            {formatPrice(product.price)}
          </div>

          <p className="product-availability">
            {product.available ? "Available" : "Currently unavailable"}
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available ? "Add to Cart" : "Unavailable"}
          </button>

          <Link to="/menu" className="back-link">
            ← Back to Menu
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;

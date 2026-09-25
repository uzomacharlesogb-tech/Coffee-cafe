import { Link } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";

function Menu() {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <main className="menu-page">
      <section className="menu-header">
        <p className="eyebrow">Cafe Street</p>

        <h1>Our Menu</h1>

        <p>
          Discover your next favorite coffee, freshly prepared just for you.
        </p>
      </section>

      <section className="menu-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <Link to={`/menu/${product.id}`}>
              <div className="product-image">
                <span>{product.image}</span>
              </div>
            </Link>

            <div className="product-info">
              <p className="product-category">
                {product.category}
              </p>

              <Link to={`/menu/${product.id}`}>
                <h2>{product.name}</h2>
              </Link>

              <p>{product.description}</p>

              <div className="product-bottom">
                <strong>
                  {formatPrice(product.price)}
                </strong>

                <button
                  type="button"
                  className="add-button"
                  onClick={() => handleAddToCart(product)}
                >
                  +
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Menu;
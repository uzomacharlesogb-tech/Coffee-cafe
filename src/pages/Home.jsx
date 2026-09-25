import { Link } from "react-router-dom";
import products from "../data/products";

function Home() {
  const featuredProducts = products.slice(0, 4);

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">We have got your coffee covered</p>

          <h1>
            Fall in love with
            <br />
            your daily coffee.
          </h1>

          <p className="home-hero-description">
            Freshly brewed coffee, delicious treats, and everything
            you need to make your day a little better.
          </p>

          <div className="home-hero-actions">
            <Link to="/menu" className="primary-button">
              Order Now
            </Link>

            <Link to="/menu" className="secondary-button">
              Explore Menu
            </Link>
          </div>
        </div>

        <div className="home-hero-image">
          <div className="hero-coffee" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Our favorites</p>
            <h2>Popular Coffee</h2>
          </div>

          <Link to="/menu" className="section-link">
            View all →
          </Link>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <article className="featured-card" key={product.id}>
              <Link to={`/menu/${product.id}`}>
                <div className="featured-image">
                  <span>{product.image}</span>
                </div>
              </Link>

              <div className="featured-info">
                <p className="product-category">
                  {product.category}
                </p>

                <Link to={`/menu/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>

                <p>{product.description}</p>

                <div className="featured-bottom">
                  <strong>
                    {formatPrice(product.price)}
                  </strong>

                  <Link
                    to={`/menu/${product.id}`}
                    className="small-order-button"
                  >
                    +
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Promo */}
      <section className="home-promo">
        <div className="promo-content">
          <p className="eyebrow">Cafe Street</p>

          <h2>
            Good coffee.
            <br />
            Good moments.
          </h2>

          <p>
            Whether you're starting your morning, taking a break,
            or catching up with friends, we've got something for you.
          </p>

          <Link to="/menu" className="primary-button">
            Explore Our Menu
          </Link>
        </div>

        <div className="promo-decoration">
          ☕
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <p className="eyebrow">Ready when you are</p>

        <h2>Your next favorite cup is waiting.</h2>

        <p>
          Browse our menu and get your coffee order started.
        </p>

        <Link to="/menu" className="primary-button">
          Start Your Order
        </Link>
      </section>
    </main>
  );
}

export default Home;
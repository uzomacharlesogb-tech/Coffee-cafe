import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <header className="site-header">
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          Cafe Street
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Menu
          </NavLink>

          {user && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Orders
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-button" aria-label="Shopping cart">
            <ShoppingBag size={22} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to={user ? "/profile" : "/login"}
            className="account-button"
            aria-label="Account"
          >
            <User size={21} />
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
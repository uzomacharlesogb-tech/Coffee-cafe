import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">Cafe Street</p>

          <h1>You're not logged in</h1>

          <p className="auth-description">Log in to access your account.</p>

          <Link to="/login" className="primary-button">
            Log In
          </Link>
        </section>
      </main>
    );
  }

  const displayName =
    user.displayName || user.email?.split("@")[0] || "Cafe Street User";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <main className="profile-page">
      <section className="profile-header">
        <p className="eyebrow">Cafe Street</p>

        <h1>My Account</h1>

        <p>Manage your account and view your orders.</p>
      </section>

      <section className="profile-card">
        <div className="profile-avatar">{avatarLetter}</div>

        <div className="profile-info">
          <h2>{displayName}</h2>

          <p>{user.email}</p>
        </div>
      </section>

      <section className="profile-actions">
        <Link to="/orders" className="profile-action">
          <span>My Orders</span>
          <span>→</span>
        </Link>

        <Link to="/menu" className="profile-action">
          <span>Browse Menu</span>
          <span>→</span>
        </Link>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </section>
    </main>
  );
}

export default Profile;

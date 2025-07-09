import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import "./Navbar.scss";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setAuth, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  // Liens du menu
  const links = [
    { to: "/", label: "Accueil" },
    { to: "/map", label: "Carte" },
    { to: "/profile", label: "Profil" },
  ];

  // Gère la déconnexion
  const handleLogout = () => {
    // Préfère clearAuth ou setAuth(null) selon ton store
    if (typeof clearAuth === "function") clearAuth();
    else if (typeof setAuth === "function") setAuth(null);
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-globe-brand">
        <Link to="/" onClick={closeMenu}>
          <img
            src="/VERT_worldscope.webp"
            alt="WorldScope"
            className="navbar-logo"
          />
          <span>Worldscope</span>
        </Link>
      </div>

      <button
        className={`navbar-toggle${menuOpen ? " open" : ""}`}
        aria-label="Menu"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      <ul className={`navbar-links${menuOpen ? " open" : ""}`}>
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className={location.pathname === l.to ? "active" : ""}
              onClick={closeMenu}
            >
              {l.label}
            </Link>
          </li>
        ))}

        {user && (
          <li className="navbar-greeting">
            <span>
              <i>Bonjour, {user.email?.split("@")[0] || "explorateur"}</i>
            </span>
          </li>
        )}

        {user && (
          <li>
            <button className="navbar-logout" onClick={handleLogout}>
              Déconnexion
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  // Liens du menu (plus besoin de cacher quoi que ce soit)
  const links = [
    { to: "/dashboard", label: "Accueil" },
    { to: "/map", label: "Carte" },
    { to: "/profile", label: "Profil" },
  ];

  return (
    <nav className="navbar-glass">
      <div className="navbar-globe-brand">
        <Link to="/dashboard" onClick={closeMenu}>
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
      </ul>
    </nav>
  );
}

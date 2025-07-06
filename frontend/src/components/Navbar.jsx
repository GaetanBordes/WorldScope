import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import './Navbar.scss';

export default function Navbar() {
  // Récupère token, user et action de logout depuis le store
  const token     = useAuthStore(state => state.token);
  const user      = useAuthStore(state => state.user);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <Link to="/">Worldscope</Link>
      </div>

      <button
        className="navbar__toggle"
        aria-label="Menu"
        onClick={() => setOpen(o => !o)}
      >
        ☰
      </button>

      <ul className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
        {token ? (
          <>
            <li>
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/map" onClick={() => setOpen(false)}>
                Carte
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={() => setOpen(false)}>
                Profil
              </Link>
            </li>
            {user && (
              <li className="navbar__greeting">
                Bonjour, {user.email.split('@')[0]}
              </li>
            )}
            <li>
              <button onClick={handleLogout}>Déconnexion</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setOpen(false)}>
                Se connecter
              </Link>
            </li>
            <li>
              <Link to="/signup" onClick={() => setOpen(false)}>
                S’inscrire
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
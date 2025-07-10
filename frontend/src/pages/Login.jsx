import { useState, useEffect } from "react";
import api from "../services/api";
import useAuthStore from "../stores/authStore";
import { useNavigate, Link } from "react-router-dom";
import "./Login.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = !!useAuthStore((s) => s.token); // <-- Ajout
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuth({ token: data.token, user: data.user });
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="login-page-bg">
      {/* 🌐 LOGO ET SLOGAN */}
      <div className="worldscope-logo-block">
        <img
          className="worldscope-logo"
          src="VERT_worldscope.webp"
          alt="Logo WorldScope"
        />
        <h1>WorldScope</h1>
        <div className="slogan">
          Visualisez, explorez, comprenez<br />
          <span>Le monde, à portée de main.</span>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
        <div className="login-register-cta">
          <span>Pas encore de compte&nbsp;?</span>
          <Link to="/signup" className="signup-link">
            🌍 Inscris-toi
          </Link>
        </div>
      </form>
      {/* Globe 3D en fond */}
      <div className="globe-bg" />
      {/* Particules décoratives */}
      <div className="space-particles"></div>
    </div>
  );
}
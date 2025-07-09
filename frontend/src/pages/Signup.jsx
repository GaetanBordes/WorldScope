import { useState } from "react";
import api from "../services/api";
import useAuthStore from "../stores/authStore";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.scss";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { email, password });
      setAuth({ token: data.token, user: data.user });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-bg">
      <form className="signup-form" onSubmit={handleSubmit}>
        <img
          src="/VERT_worldscope.webp"
          alt="Logo WorldScope"
          className="signup-logo"
        />
        <h2>Créer un compte World<span>Scope</span></h2>
        <div className="signup-fields">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Création en cours..." : "S’inscrire"}
        </button>
        <p className="signup-link">
          Déjà un compte? <Link to="/login">Connecte-toi</Link>
        </p>
      </form>
    </div>
  );
}
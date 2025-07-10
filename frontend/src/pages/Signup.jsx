import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.scss";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { email, password });
      alert("Inscription réussie !");
      navigate("/login"); // Redirige vers login
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l’inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Inscription</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">S’inscrire</button>
      <p>
        Déjà un compte? <Link to="/login">Connecte-toi</Link>
      </p>
    </form>
  );
}
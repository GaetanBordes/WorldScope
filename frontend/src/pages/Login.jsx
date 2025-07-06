import { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth({ token: data.token, user: data.user });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la connexion');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Se connecter</button>
      <p>
        Pas encore de compte? <Link to="/signup">Inscris-toi</Link>
      </p>
    </form>
  );
}
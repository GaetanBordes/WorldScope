import React, { useEffect, useState } from 'react';
import api from '../services/api';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore(state => state.clearAuth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/user/me')
      .then(res => setProfile(res.data))
      .catch(() => {
        clearAuth();
        navigate('/login');
      });
  }, []);

  if (!profile) return <div>Chargement…</div>;

  return (
    <div>
      <h1>Bienvenue, {profile.email}!</h1>
      <p>Inscrit le : {new Date(profile.createdAt).toLocaleDateString()}</p>
      <button onClick={() => {
        clearAuth();
        navigate('/login');
      }}>Se déconnecter</button>
    </div>
  );
}
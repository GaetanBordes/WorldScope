import React, { useState, useEffect } from 'react';
import api from '../services/api';
import "./ProfilePage.scss";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [passwordToDelete, setPasswordToDelete] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/me').then(res => {
      setProfile(res.data);
      setNewEmail(res.data.email);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="profile-loader">Chargement…</div>;

  const updateEmail = async () => {
    if (!newEmail) return alert("Merci de saisir un email valide !");
    await api.put('/user/me', { email: newEmail });
    alert('Email mis à jour');
  };

  const exportData = async () => {
    await api.post('/user/me/export');
    alert('Email d’export envoyé !');
  };

  const deleteAccount = async () => {
    if (!window.confirm('Confirmer la suppression du compte ?')) return;
    await api.delete('/user/me', { data: { password: passwordToDelete } });
    alert('Compte supprimé');
    window.location.href = '/login';
  };

  return (
    <div className="profile-bg">
      <div className="profile-card">
        <div className="profile-avatar">
          <img src="/VERT_worldscope.webp" alt="Globe WorldScope" />
        </div>
        <h2 className="profile-title">Mon Profil</h2>
        <div className="profile-details">
          <p>
            <span className="profile-label">Email :</span>
            <input
              type="email"
              value={newEmail}
              className="profile-input"
              onChange={e => setNewEmail(e.target.value)}
            />
            <button className="profile-btn" onClick={updateEmail}>
              Modifier
            </button>
          </p>
          <p>
            <span className="profile-label">Inscrit le :</span>
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="profile-actions">
          <button className="profile-btn" onClick={exportData}>
            Exporter mes données
          </button>
        </div>
        <div className="profile-delete">
          <h3>Supprimer mon compte</h3>
          <input
            type="password"
            placeholder="Mot de passe actuel"
            className="profile-input"
            value={passwordToDelete}
            onChange={e => setPasswordToDelete(e.target.value)}
          />
          <button className="profile-btn profile-btn-delete" onClick={deleteAccount}>
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
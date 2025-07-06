import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [passwordToDelete, setPasswordToDelete] = useState('');

  useEffect(() => {
    api.get('/user/me').then(res => {
      setProfile(res.data);
      setNewEmail(res.data.email);
    });
  }, []);

  if (!profile) return <div>Chargement…</div>;

  const updateEmail = async () => {
    await api.put('/user/me', { email: newEmail });
    alert('Email mis à jour');
  };

  const exportData = async () => {
    await api.post('/user/me/export');
    alert('Email d’export envoyé');
  };

  const deleteAccount = async () => {
    if (!window.confirm('Confirmer la suppression du compte ?')) return;
    await api.delete('/user/me', { data: { password: passwordToDelete } });
    alert('Compte supprimé');
    window.location.href = '/login';
  };

  return (
    <div className="profile-page">
      <h2>Mon Profil</h2>
      <p>Inscrit le : {new Date(profile.createdAt).toLocaleDateString()}</p>
      <div>
        <label>
          Email : 
          <input 
            type="email" 
            value={newEmail} 
            onChange={e => setNewEmail(e.target.value)} 
          />
        </label>
        <button onClick={updateEmail}>Modifier mon email</button>
      </div>
      <div>
        <button onClick={exportData}>Exporter mes données (JSON par email)</button>
      </div>
      <div>
        <h3>Supprimer mon compte</h3>
        <input
          type="password"
          placeholder="Mot de passe actuel"
          value={passwordToDelete}
          onChange={e => setPasswordToDelete(e.target.value)}
        />
        <button onClick={deleteAccount}>Supprimer mon compte</button>
      </div>
    </div>
  );
}
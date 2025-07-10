import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* décale le contenu pour laisser la place à la navbar fixe */}
      <div style={{ paddingTop: '3.5rem', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          {/* Page d'accueil publique */}
          <Route path="/" element={<Dashboard />} />

          {/* Routes publiques */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Catch-all */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

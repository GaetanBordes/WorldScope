import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';

// import ProtectedRoute from './components/ProtectedRoute'; // plus besoin

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* décale le contenu pour laisser la place à la navbar fixe */}
      <div style={{ paddingTop: '3.5rem', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          {/* Accueil = Dashboard */}
          <Route path="/" element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          } />

          {/* Toutes routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          } />
          <Route path="/map" element={
            <ErrorBoundary>
              <MapPage />
            </ErrorBoundary>
          } />
          <Route path="/profile" element={
            <ErrorBoundary>
              <ProfilePage />
            </ErrorBoundary>
          } />

          {/* Catch-all */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

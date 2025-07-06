import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* décale le contenu pour laisser la place à la navbar fixe */}
      <div style={{ paddingTop: '3.5rem', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          {/* redirection automatique selon auth */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Routes publiques */}
          <Route path="/login"  element={<Login  />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          />

          <Route
            path="/map"
            element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <MapPage />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          />

          <Route
            path="/profile"
            element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// SCSS globaux
import './styles/global.scss';

// SCSS composants
import './components/Navbar.scss';
import './components/MapView.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
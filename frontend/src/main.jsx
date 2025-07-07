import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// SCSS globaux
import './styles/global.scss';

// SCSS composants (ajoute ici SEULEMENT ceux qui existent encore !)
import './components/Navbar.scss';

// Ne pas importer MapView.scss si tu n’as plus MapView

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
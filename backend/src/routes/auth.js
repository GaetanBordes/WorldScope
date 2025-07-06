const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login } = require('../controllers/authController');

// Inscription
router.post('/signup', signup);

// Vérification email (clic sur lien)
router.get('/verify/:token', verifyEmail);

// Connexion
router.post('/login', login);

module.exports = router;
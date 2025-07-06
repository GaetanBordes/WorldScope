const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  getMe,
  updateMe,
  exportMe,
  deleteMe
} = require('../controllers/userController');

// Lecture profil
router.get('/me', authenticateToken, getMe);

// Mise à jour email
router.put('/me', authenticateToken, updateMe);

// Export JSON par email
router.post('/me/export', authenticateToken, exportMe);

// Suppression de compte (mot de passe dans body)
router.delete('/me', authenticateToken, deleteMe);

module.exports = router;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // header: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // on récupère l'user en DB pour s'assurer qu'il existe toujours
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide.' });
  }
}

module.exports = { authenticateToken };
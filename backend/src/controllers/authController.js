require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET;
const PUBLIC_URL = process.env.PUBLIC_URL;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function renderTemplate(name, vars) {
  const file = path.join(__dirname, '../../views', name);
  let content = fs.readFileSync(file, 'utf-8');
  Object.entries(vars).forEach(([key, val]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });
  return content;
}

async function signup(req, res, next) {
  try {
    const { email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });

    // Génère un token courte durée pour vérification
    const verifyToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    const verifyURL = `${PUBLIC_URL}/auth/verify/${verifyToken}`;

    // Envoi email
    await transporter.sendMail({
      from: `"Worldscope" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Veuillez vérifier votre email',
      html: renderTemplate('verifyEmail.html', { VERIFY_URL: verifyURL })
    });

    res.status(201).json({ message: 'Inscription réussie, vérifiez votre email.' });
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  const { token } = req.params;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { emailVerified: true }
    });
    // affiche page emailVerified.html
    res.send(renderTemplate('emailVerified.html', { PUBLIC_URL }));
  } catch (e) {
    res.send(renderTemplate('tokenInvalid.html', { PUBLIC_URL }));
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.emailVerified) 
      return res.status(401).json({ error: 'Email non vérifié ou utilisateur introuvable.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Identifiants invalides.' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, verifyEmail, login };
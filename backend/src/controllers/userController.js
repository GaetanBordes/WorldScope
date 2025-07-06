const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Mailer déjà configuré dans authController, tu peux le réutiliser

async function getMe(req, res) {
  const { id, email, createdAt, updatedAt } = req.user;
  res.json({ id, email, createdAt, updatedAt });
}

async function updateMe(req, res) {
  const { email } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { email }
  });
  res.json({ id: user.id, email: user.email });
}

async function exportMe(req, res) {
  const user = req.user;
  const data = JSON.stringify(user, null, 2);
  // envoi par email
  await nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  }).sendMail({
    from: `"Worldscope" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Votre export de données',
    text: 'Vous trouverez ci‑joint vos données au format JSON.',
    attachments: [{ filename: 'data.json', content: data }]
  });
  res.json({ message: 'Export envoyé par email.' });
}

async function deleteMe(req, res) {
  const { password } = req.body;
  const valid = await require('bcryptjs').compare(password, req.user.password);
  if (!valid) return res.status(401).json({ error: 'Mot de passe invalide.' });
  await prisma.user.delete({ where: { id: req.user.id } });
  res.json({ message: 'Compte supprimé.' });
}

module.exports = { getMe, updateMe, exportMe, deleteMe };
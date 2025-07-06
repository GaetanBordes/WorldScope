const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth & user routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

app.use('/auth', authRouter);
app.use('/user', userRouter);

// CSV loading
let acledData = [];

const csvPath = path.resolve(__dirname, '../data/acled.csv');
if (fs.existsSync(csvPath)) {
  fs.createReadStream(csvPath)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error('❌ Erreur de lecture CSV :', error))
    .on('data', row => acledData.push(row))
    .on('end', () => {
      console.log(`✅ ${acledData.length} incidents chargés depuis le CSV`);
    });
} else {
  console.warn('⚠️ Fichier CSV non trouvé !');
}

// API: renvoyer incidents depuis CSV
app.get('/api/acled-local', (req, res) => {
  const limit = parseInt(req.query.limit || '500');
  const trimmed = acledData.slice(0, limit);
  res.json({ data: trimmed });
});

// Sanity check
app.get('/', (req, res) => {
  res.send('🌍 WorldScope backend en ligne.');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;

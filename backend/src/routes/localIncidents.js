const fs   = require('fs');
const path = require('path');
const csv  = require('fast-csv');
const express = require('express');
const router  = express.Router();

// Chemin vers le CSV (le nom de fichier doit correspondre)
const CSV_PATH = path.join(__dirname, '..', '..', 'data', 'acled.csv');

// Nous stockons en mémoire tous les événements valides
const ALL_EVENTS = [];

// Au démarrage, on lit et on parse le CSV une fois pour toutes
fs.createReadStream(CSV_PATH)
  .pipe(csv.parse({
    headers: true,
    delimiter: ',',    // ← MAJ ici : le CSV utilise des virgules
    quote: '"'         // guillemets pour les champs qui contiennent des virgules
  }))
  .on('error', err => console.error('Erreur CSV:', err))
  .on('data', row => {
    // On filtre les lignes qui ont bien ce dont on a besoin
    if (row.latitude && row.longitude && row.event_date && row.event_type) {
      ALL_EVENTS.push({
        latitude:  parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        country:   row.country,
        date:      row.event_date,
        type:      row.event_type
      });
    }
  })
  .on('end', rowCount => {
    console.log(`✅ CSV chargé (${rowCount} lignes)`);
  });

// Route GET /api/acled-local?days=…&limit=…
router.get('/', (req, res) => {
  let { days = 180, limit = 500 } = req.query;
  days  = parseInt(days, 10);
  limit = parseInt(limit, 10);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const filtered = ALL_EVENTS
    .filter(evt => new Date(evt.date) >= cutoff)
    .slice(0, limit);

  res.json({ data: filtered });
});

module.exports = router;
const express = require('express');
const fs = require('fs');
const router = express.Router();

const data = JSON.parse(fs.readFileSync('./data/acled.json', 'utf8'));

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit || 1000, 10);
  return res.json(data.slice(0, limit));
});

module.exports = router;
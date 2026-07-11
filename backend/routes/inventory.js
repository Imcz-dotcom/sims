const express = require('express');
const router = express.Router();
const SSD = require('../models/SSD');

// POST /api/inventory - Add new SSD
router.post('/', async (req, res) => {
  try {
    const ssd = new SSD(req.body);
    await ssd.save();
    res.status(201).json({ message: 'SSD registered successfully', data: ssd });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/inventory - Get all SSDs
router.get('/', async (req, res) => {
  try {
    const ssds = await SSD.find();
    res.json(ssds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

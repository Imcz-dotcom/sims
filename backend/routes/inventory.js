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

// PUT /api/inventory/:id - Update an SSD
router.put('/:id', async (req, res) => {
  try {
    const ssd = await SSD.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ssd) {
      return res.status(404).json({ error: 'SSD not found' });
    }
    res.json({ message: 'SSD updated successfully', data: ssd });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/inventory/:id - Remove an SSD
router.delete('/:id', async (req, res) => {
  try {
    const ssd = await SSD.findByIdAndDelete(req.params.id);
    if (!ssd) {
      return res.status(404).json({ error: 'SSD not found' });
    }
    res.json({ message: 'SSD deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

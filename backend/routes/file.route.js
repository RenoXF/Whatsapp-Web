const express = require('express');
const router = express.Router();
const fileModel = require('../db/fileModel');

// 🧭 GET metadata semua file
router.get('/', (_, res) => {
  try {
    const files = fileModel.getAllFiles();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 POST file metadata (upload via Cloudinary / backend terpisah)
router.post('/', (req, res) => {
  try {
    const file = req.body;

    // 🚨 Validasi dasar
    if (!file.file_id || !file.filename || !file.mime_type) {
      return res.status(400).json({ error: 'Invalid file metadata' });
    }

    fileModel.insertFile(file);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
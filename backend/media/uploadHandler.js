const multer = require('multer');
const { storeFile, getFileMetadata } = require('./mediaService');
const { saveMetadata } = require('../db/fileModel');

const upload = multer({ storage: multer.memoryStorage() });

module.exports = (router) => {
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'File tidak ditemukan' });

      const stored = await storeFile(file); // simpan ke Cloudinary/lokal
      const metadata = getFileMetadata(file, stored);
      await saveMetadata(metadata); // simpan ke DB

      res.json({ success: true, data: metadata });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Gagal upload file' });
    }
  });
};
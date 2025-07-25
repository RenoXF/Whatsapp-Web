const express = require('express');
const router = express.Router();
const { baileysSocket } = require('../core/baileysClient'); // atau simpan sock di global/shared

router.post('/', async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ error: 'to & message wajib diisi' });

    const result = await baileysSocket.sendMessage(to, { text: message });

    res.status(200).json({
      status: 'success',
      to,
      message,
      messageId: result.key.id,
    });
  } catch (err) {
    console.error('❌ Gagal kirim pesan:', err.message);
    res.status(500).json({ error: 'Gagal kirim pesan' });
  }
});

module.exports = router;
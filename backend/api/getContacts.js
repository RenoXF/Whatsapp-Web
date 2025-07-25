const express = require('express');
const router = express.Router();
const { baileysSocket } = require('../core/baileysClient'); // pastikan ini sudah disiapkan

router.get('/', async (req, res) => {
  try {
    const contactsMap = baileysSocket?.contacts;
    if (!contactsMap) return res.status(500).json({ error: 'Belum terhubung ke WhatsApp' });

    const contacts = Object.values(contactsMap).map((c) => ({
      id: c.id,
      name: c.name || c.notify || c.id.split('@')[0],
      status: c.status || '',
      imgUrl: c.imgUrl || null, // jika nanti ingin tambahkan avatar
    }));

    res.status(200).json({ contacts });
  } catch (err) {
    console.error('❌ Gagal ambil kontak:', err.message);
    res.status(500).json({ error: 'Gagal ambil kontak' });
  }
});

module.exports = router;
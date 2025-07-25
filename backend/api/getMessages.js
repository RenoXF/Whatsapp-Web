const express = require('express');
const router = express.Router();
const { baileysSocket } = require('../core/baileysClient'); // asumsi sock disimpan global

router.get('/', async (req, res) => {
  try {
    const chatList = baileysSocket?.chats;
    if (!chatList) return res.status(500).json({ error: 'Belum tersambung ke WhatsApp' });

    const messages = Object.values(chatList).map(chat => ({
      chatId: chat.id,
      name: chat.name || chat.id.split('@')[0],
      lastMessage: chat.messages?.[chat.messages.length - 1]?.message || '—',
      timestamp: chat.messages?.[chat.messages.length - 1]?.messageTimestamp || null,
    }));

    res.status(200).json({ messages });
  } catch (err) {
    console.error('❌ Gagal ambil pesan:', err.message);
    res.status(500).json({ error: 'Gagal ambil histori pesan' });
  }
});

module.exports = router;
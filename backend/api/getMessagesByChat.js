const express = require('express');
const router = express.Router();
const { baileysSocket } = require('../core/baileysClient');

router.get('/:chatId', async (req, res) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) return res.status(400).json({ error: 'chatId wajib disertakan' });

    const chat = baileysSocket?.chats[chatId];
    if (!chat || !chat.messages) {
      return res.status(404).json({ error: 'Chat tidak ditemukan atau belum ada pesan' });
    }

    const messages = chat.messages.map((msg) => ({
      id: msg.key.id,
      fromMe: msg.key.fromMe,
      sender: msg.key.remoteJid,
      type: Object.keys(msg.message)[0],
      content: msg.message?.conversation ||
               msg.message?.extendedTextMessage?.text ||
               '[Non-text Message]',
      timestamp: msg.messageTimestamp,
    }));

    res.status(200).json({ chatId, messages });
  } catch (err) {
    console.error('❌ Error getMessagesByChat:', err.message);
    res.status(500).json({ error: 'Gagal ambil pesan chat' });
  }
});

module.exports = router;
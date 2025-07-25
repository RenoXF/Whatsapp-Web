const express = require('express');
const router = express.Router();
const chatModel = require('../db/chatModel');
const db = require('../db/database');

// GET last 20 chat
router.get('/recent', (_, res) => {
  const chats = chatModel.getRecentChats();
  res.json(chats);
});

// POST new chat
router.post('/', (req, res) => {
  console.log('[REQ BODY]', req.body); // untuk verifikasi
  try {
    chatModel.insertChat(req.body);
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('[Insert Error]', err);
    res.status(400).json({ error: err.message });
  }
});


function insertChat(data) {
  const stmt = db.prepare(`
    INSERT INTO chats (
      id, chat_id, sender_name, phone_number, message,
      attachment_id, timestamp, is_group, from_me
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    data.id,
    data.chat_id,
    data.sender_name,
    data.phone_number,
    data.message,
    data.attachment_id || null,
    data.timestamp,
    data.is_group || false,
    data.from_me || false
  );
}

function insertChat(data) {
  console.log('[DEBUG insertChat]', data); // 👀
}


module.exports = router;
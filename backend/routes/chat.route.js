const express = require('express');
const router = express.Router();
const chatModel = require('../db/chatModel');

// GET last 20 chat
router.get('/recent', (_, res) => {
  const chats = chatModel.getRecentChats();
  res.json(chats);
});

// POST new chat
router.post('/', (req, res) => {
  try {
    chatModel.insertChat(req.body);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
const db = require('./database');

function insertChat(data) {
  const stmt = db.prepare(`
    INSERT INTO chats (id, chat_id, sender_name, phone_number, message, attachment_id, timestamp, is_group, from_me)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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

function getRecentChats() {
  const stmt = db.prepare(`
    SELECT * FROM chats ORDER BY timestamp DESC LIMIT 20
  `);
  return stmt.all();
}

module.exports = { insertChat, getRecentChats };
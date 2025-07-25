const db = require('./database');

function insertChat(data) {
  if (!data || !data.id || !data.chat_id || !data.timestamp) {
    throw new Error('Missing required fields: id, chat_id, timestamp');
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO chats (
        id, chat_id, sender_name, phone_number, message,
        attachment_id, timestamp, is_group, from_me
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.id,
      data.chat_id,
      data.sender_name || '',
      data.phone_number || '',
      data.message || '',
      data.attachment_id || null,
      data.timestamp,
      data.is_group ? 1 : 0,
      data.from_me ? 1 : 0
    );
  } catch (err) {
    console.error('[insertChat ERROR]', err);
    throw new Error('Failed to insert chat');
  }
}

function getRecentChats(limit = 20) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM chats
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(limit);
  } catch (err) {
    console.error('[getRecentChats ERROR]', err);
    return [];
  }
}

module.exports = { insertChat, getRecentChats };
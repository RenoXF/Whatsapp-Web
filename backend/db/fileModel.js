const db = require('./database');

async function saveMetadata(data) {
  await db.run(
    `INSERT INTO files (name, type, size, url, local_path, uploaded_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.name, data.type, data.size, data.url, data.localPath, data.uploadedAt]
  );
}

module.exports = { saveMetadata };
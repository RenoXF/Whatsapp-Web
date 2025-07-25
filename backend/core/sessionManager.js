const fs = require('fs');
const path = require('path');

function ensureSessionFolder() {
  const folderPath = path.join(__dirname, '..', 'session');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log('📂 Folder session dibuat:', folderPath);
  }
}

module.exports = { ensureSessionFolder };
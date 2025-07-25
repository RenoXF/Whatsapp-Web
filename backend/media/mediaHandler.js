const path = require('path');
const fs = require('fs');

function storeFile(file) {
  const uploadPath = path.join(__dirname, 'uploads', file.originalname);
  fs.writeFileSync(uploadPath, file.buffer);
  return { path: uploadPath, url: `/uploads/${file.originalname}` };
}

function getFileMetadata(file, stored) {
  return {
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
    url: stored.url,
    localPath: stored.path,
    uploadedAt: Date.now()
  };
}

module.exports = { storeFile, getFileMetadata };
const Database = require('better-sqlite3');
const path = require('path');

// Lokasi file database
const dbPath = path.join(__dirname, 'database.db');

// Inisialisasi DB
const db = new Database(dbPath, { verbose: console.log });

module.exports = db;
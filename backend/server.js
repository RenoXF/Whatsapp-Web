const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createBaileysClient } = require('./core/baileysClient');
const { registerSocket } = require('./core/socketHandler');
const { ensureSessionFolder } = require('./core/sessionManager');
const getMessagesByChatRoute = require('./api/getMessagesByChat');
const helmet = require('helmet');
const path = require('path');
const db = require('./db/database');


// Optional: import endpoint API modular
const sendMessageRoute = require('./api/sendMessage');
const getContactsRoute = require('./api/getContacts');

// 🔧 Import database
const chatRoute = require('./routes/chat.route');
const fileRoute = require('./routes/file.route');

ensureSessionFolder(); // pastikan folder session tersedia

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging koneksi SQLite
console.log('[SQLite] Connected to:', path.basename(db.name));


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Pasang API routes
app.use('/send-message', sendMessageRoute);
app.use('/get-contacts', getContactsRoute);
app.use('/get-messages-by-chat', getMessagesByChatRoute);
app.use('/api/chat', chatRoute);
app.use('/api/file', fileRoute);

// 🩺 Health check
app.get('/health', (_, res) => {
  res.json({ status: 'OK', sqlite: !!db });
});


// Inisialisasi koneksi WhatsApp & Socket.IO
(async () => {
  const sock = await createBaileysClient();
  registerSocket(io, sock);
})();

server.listen(5000, () => {
  console.log('🚀 Server WhatsApp Gateway aktif di http://localhost:5000');
});
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createBaileysClient } = require('./core/baileysClient');
const { registerSocket } = require('./core/socketHandler');
const { ensureSessionFolder } = require('./core/sessionManager');
const getMessagesByChatRoute = require('./api/getMessagesByChat');

// Optional: import endpoint API modular
const sendMessageRoute = require('./api/sendMessage');
const getContactsRoute = require('./api/getContacts');

ensureSessionFolder(); // pastikan folder session tersedia

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// Pasang API routes
app.use('/send-message', sendMessageRoute);
app.use('/get-contacts', getContactsRoute);
app.use('/get-messages-by-chat', getMessagesByChatRoute);

// Inisialisasi koneksi WhatsApp & Socket.IO
(async () => {
  const sock = await createBaileysClient();
  registerSocket(io, sock);
})();

server.listen(5000, () => {
  console.log('🚀 Server WhatsApp Gateway aktif di http://localhost:5000');
});
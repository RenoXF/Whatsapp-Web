function registerSocket(io, sock) {
  io.on('connection', (socket) => {
    console.log(`📲 Frontend terhubung: ${socket.id}`);

    // Kirim pesan dari WA ke client
    sock.ev.on('messages.upsert', async ({ messages }) => {
      if (!messages || !messages[0]?.message) return;
      socket.emit('message:incoming', messages[0]);
    });

    // Terima pesan dari frontend, kirim ke WA
    socket.on('message:send', async (payload) => {
      try {
        const { to, text } = payload;
        await sock.sendMessage(to, { text });
        socket.emit('message:sent', { to, text });
      } catch (err) {
        socket.emit('message:error', err.message);
      }
    });
  });
}

module.exports = { registerSocket };
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('baileys');
const { Boom } = require('@hapi/boom');
const QRCode = require('qrcode'); // <-- Tambahkan baris ini

async function createBaileysClient() {
  // Ambil state dan fungsi simpan kredensial
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  // Buat socket dengan state yang sudah ada
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ['Safari', 'Desktop', '1.0'],
  });

  // Simpan kredensial setiap ada update
  sock.ev.on('creds.update', saveCreds);

  // Handler update koneksi
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      const qrString = await QRCode.toString(qr, { type: 'terminal' });
      console.log(qrString);
    }
    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error instanceof Boom)
        ? lastDisconnect.error.output?.statusCode
        : undefined;
      if (statusCode === DisconnectReason.restartRequired) {
        console.log('🔄 Restart required, reconnecting...');
        createBaileysClient();
      } else {
        console.log('❌ Terputus, alasan:', statusCode);
      }
    } else if (connection === 'open') {
      console.log('✅ Tersambung ke WhatsApp');
    }
  });

  return sock;
}

module.exports = { createBaileysClient };
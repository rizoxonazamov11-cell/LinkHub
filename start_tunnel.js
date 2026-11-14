const http = require('http');
const fs = require('fs');
const path = require('path');
const localtunnel = require('localtunnel');

const PORT = 3000;
const SUBDOMAIN = 'azamov-muhammadrizo';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// 1. Web serverni yaratish
const server = http.createServer((req, res) => {
  // bypass localtunnel reminder header
  res.setHeader('bypass-tunnel-reminder', 'true');

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Sahifa topilmadi');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Server xatosi: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
  connectTunnel();
});

// 2. Avtomatik tiklanuvchi doimiy tunnel
let currentTunnel = null;

function connectTunnel() {
  console.log('Tunnel ulanmoqda...');
  localtunnel({ port: PORT, subdomain: SUBDOMAIN }, (err, tunnel) => {
    if (err) {
      console.error('Tunnel xatosi:', err.message);
      setTimeout(connectTunnel, 3000);
      return;
    }

    currentTunnel = tunnel;
    console.log(`>>> JONLI LINK TAYYOR: ${tunnel.url}`);

    tunnel.on('close', () => {
      console.log('Tunnel yopildi, qayta ulanmoqda...');
      setTimeout(connectTunnel, 2000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnelda xatolik:', err);
    });
  });
}

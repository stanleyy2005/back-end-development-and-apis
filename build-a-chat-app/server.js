import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
  if (req.url.split('?')[0] === '/script.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end(fs.readFileSync('./public/script.js'));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync('./public/index.html'));
});

const wss = new WebSocketServer({ server });

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(message);
  });
}

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, 'http://localhost').searchParams.get(
    'username',
  );

  broadcast({ type: 'system', text: `${username} joined` });

  socket.on('message', (raw) => {
    try {
      const { username, text } = JSON.parse(raw.toString());
      broadcast({ type: 'chat', username, text });
    } catch (err) {
      // ignore invalid JSON
    }
  });

  socket.on('close', () => {
    broadcast({ type: 'system', text: `${username} left` });
  });
});

server.listen(PORT, () => {
  console.log('Chat server running at http://localhost:3001');
});

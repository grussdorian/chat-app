const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'register':
        const userId = uuid.v4();
        users.set(userId, ws);
        ws.send(JSON.stringify({ type: 'register', id: userId }));
        break;
      case 'message':
        const recipient = users.get(data.to);
        if (recipient) {
          recipient.send(JSON.stringify({ type: 'message', from: data.from, text: data.text }));
        }
        break;
      default:
        console.error('Unknown message type:', data.type);
    }
  });

  ws.on('close', () => {
    for (const [id, socket] of users.entries()) {
      if (socket === ws) {
        users.delete(id);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});

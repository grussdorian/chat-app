const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = new Map();

wss.on('connection', (ws) => {
  const userId = uuid.v4();
  ws.send(JSON.stringify({ type: 'register', id: userId }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'register':
        if (users.has(data.username)) {
          ws.send(JSON.stringify({ type: 'register', status: 'failed', message: 'Username already exists' }));
        } else {
          users.set(data.username, { id: userId, ws: ws });
          ws.send(JSON.stringify({ type: 'register', status: 'success', username: data.username }));
        }
        break;
      case 'message':
        const recipient = users.get(data.to);
        if (recipient) {
          recipient.ws.send(JSON.stringify({ type: 'message', from: data.from, text: data.text }));
        }
        break;
      default:
        console.error('Unknown message type:', data.type);
    }
  });

  ws.on('close', () => {
    for (const [username, user] of users.entries()) {
      if (user.ws === ws) {
        users.delete(username);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});

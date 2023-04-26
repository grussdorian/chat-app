const ws = new WebSocket('ws://localhost:3000');
const userId = document.getElementById('userId');
const registerBtn = document.getElementById('register');
const recipientId = document.getElementById('recipientId');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');
const messages = document.getElementById('messages');

registerBtn.addEventListener('click', () => {
  ws.send(JSON.stringify({ type: 'register' }));
});

sendBtn.addEventListener('click', () => {
  ws.send(JSON.stringify({
    type: 'message',
    from: userId.value,
    to: recipientId.value,
    text: messageInput.value,
  }));
  messageInput.value = '';
});

ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'register':
      userId.value = data.id;
      break;
    case 'message':
      const li = document.createElement('li');
      li.textContent = `[${data.from}] ${data.text}`;
      messages.appendChild(li);
      break;
    default:
      console.error('Unknown message type:', data.type);
  }
});

ws.addEventListener('open', () => {
  console.log('Connected to WebSocket server');
});

ws.addEventListener('close', () => {
  console.log('Disconnected from WebSocket server');
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

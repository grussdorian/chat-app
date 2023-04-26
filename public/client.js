// Replace this with a proper key exchange and encryption library, such as the Web Cryptography API or libsodium
function encrypt(text) {
  return btoa(text);
}

function decrypt(text) {
  return atob(text);
}

const ws = new WebSocket('ws://localhost:3000');
const username = document.getElementById('username');
const registerBtn = document.getElementById('register');
const recipient = document.getElementById('recipient');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');
const messages = document.getElementById('messages');

registerBtn.addEventListener('click', () => {
  ws.send(JSON.stringify({ type: 'register', username: username.value }));
});

sendBtn.addEventListener('click', () => {
  const encryptedMessage = encrypt(messageInput.value);
  ws.send(JSON.stringify({
    type: 'message',
    from: username.value,
    to: recipient.value,
    text: encryptedMessage,
  }));
  messageInput.value = '';
});

ws.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'register':
      if (data.status === 'success') {
        username.readOnly = true;
        registerBtn.disabled = true;
      } else {
        alert(data.message);
      }
      break;
    case 'message':
      const decryptedMessage = decrypt(data.text);
      const li = document.createElement('li');
      li.textContent = `[${data.from}] ${decryptedMessage}`;
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

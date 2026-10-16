document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;

  displayMessage(message, 'user');
  input.value = '';

  // Simulate bot "typing..." delay
  const typingIndicator = displayMessage('Typing...', 'bot', true);

  const response = await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await response.json();

  // Remove typing...
  typingIndicator.remove();

  // Show bot response
  displayMessage(data.reply, 'bot');
}

function displayMessage(message, sender, isTyping = false) {
  const chatBox = document.getElementById('chat-box');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = message;

  if (!isTyping) {
    const time = document.createElement('div');
    time.className = 'timestamp';
    time.textContent = new Date().toLocaleTimeString();
    messageDiv.appendChild(time);
  }

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return messageDiv;
}

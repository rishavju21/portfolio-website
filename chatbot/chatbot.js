function initializeChatbot() {
  const chatIcon = document.getElementById('chatIcon');
  const chatBox = document.getElementById('chatBox');
  const closeChat = document.getElementById('closeChat');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatMessage');
  const chatMessages = document.getElementById('chatMessages');

  if (!chatIcon || !chatBox || !closeChat || !chatForm || !chatInput || !chatMessages) {
    console.error("Chatbot elements not found");
    return;
  }

  chatIcon.addEventListener('click', () => {
    chatBox.style.display = 'flex';
    chatIcon.style.display = 'none';

  // Clear any previous chat history
  chatMessages.innerHTML = '';

  // Show welcome message
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'chat-message bot';
  welcomeMsg.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">How may I help you?</div>
  `;
  chatMessages.appendChild(welcomeMsg);
});   

  closeChat.addEventListener('click', () => {
    chatBox.style.display = 'none';
    chatIcon.style.display = 'block';
      // Optional: Clear chat when closed
    chatMessages.innerHTML = '';
  });

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Display user message
    const userMsg = document.createElement('div');
userMsg.className = 'chat-message user';
userMsg.innerHTML = `<div class="bubble">${userMessage}</div><div class="avatar right">🧑</div>`;
chatMessages.appendChild(userMsg);

    chatInput.value = ''; // ✅ Clear the input field
          chatMessages.scrollTop = chatMessages.scrollHeight;


    // Send to n8n
    try {
      const response = await fetch('https://n8n.rishavkumar.site/webhook/chat-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const result = await response.json();
      console.log("Webhook response:", result);

      const reply = result.content || result.reply || 'Sorry, no response.';

      // Append bot response (left-aligned)
const botMsg = document.createElement('div');
botMsg.className = 'chat-message bot';
botMsg.innerHTML = `<div class="avatar">🤖</div><div class="bubble">${reply}</div>`;
chatMessages.appendChild(botMsg);

      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
      chatMessages.innerHTML += `
        <div class="chat-message bot">
          <img src="assets/bot.png" class="avatar" />
          <div class="message-text">Error occurred. Try again.</div>
        </div>
      `;
    }
  });
}

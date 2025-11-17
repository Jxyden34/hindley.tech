// chatbot.js – front-end logic

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messagesDiv = document.getElementById("chatbot-messages");

chatbotToggle.onclick = () => {
  chatbotContainer.style.display =
    chatbotContainer.style.display === "flex" ? "none" : "flex";
};

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  userInput.value = "";
  appendMessage("bot", "Thinking...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    const botReply = data.reply || "Sorry, I didn’t understand that.";
    updateLastBotMessage(botReply);
  } catch (error) {
    updateLastBotMessage("?? Error connecting to server.");
    console.error(error);
  }
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function updateLastBotMessage(text) {
  const botMessages = document.querySelectorAll(".message.bot");
  if (botMessages.length > 0) {
    botMessages[botMessages.length - 1].textContent = text;
  }
}

sendBtn.onclick = sendMessage;
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// chatbot.js

const chatBtn = document.getElementById("chatbot-toggle");
const chatContainer = document.getElementById("chatbot-container");
const messagesDiv = document.getElementById("chatbot-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Toggle Chat
chatBtn.addEventListener("click", () => {
    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "flex";
        userInput.focus();
    } else {
        chatContainer.style.display = "none";
    }
});

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Add user message
    appendMessage("user", text);
    userInput.value = "";

    // Add placeholder bot message
    appendMessage("bot", "Thinking...");

    try {
        // Connect to the backend on port 3000
        // Determine API URL
        let apiUrl = "http://localhost:3000/api/chat"; // Default for file:// or simple local

        if (window.location.protocol !== "file:") {
            // If we are on http/https, try to reach port 3000 on the same hostname
            // Note: If you are on HTTPS, this might fail due to Mixed Content if the backend is HTTP
            apiUrl = `${window.location.protocol}//${window.location.hostname}:3000/api/chat`;
        }

        console.log("Chatbot connecting to:", apiUrl);
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        });

        const data = await response.json();
        const botReply = data.reply || "Sorry, I didn’t understand that.";
        updateLastBotMessage(botReply);
    } catch (error) {
        updateLastBotMessage("❌ Error connecting to server.");
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

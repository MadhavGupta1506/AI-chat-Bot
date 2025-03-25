document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.querySelector(".message-input");
    const sendButton = document.querySelector(".send-button");
    const chatMessages = document.querySelector(".chat-messages");

    function appendMessage(sender, text) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        const avatar = document.createElement("div");
        avatar.classList.add("avatar", sender === "bot" ? "bot-avatar" : "user-avatar");
        avatar.textContent = sender === "bot" ? "G" : "U";

        const message = document.createElement("div");
        message.classList.add("message", sender === "bot" ? "bot-message" : "user-message");
        message.textContent = text;

        messageContainer.appendChild(avatar);
        messageContainer.appendChild(message);
        chatMessages.appendChild(messageContainer);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (userMessage === "") return;

        appendMessage("user", userMessage);
        messageInput.value = "";

        fetch("/chat", {  // <-- Changed to relative path for deployment
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage("bot", data.response);
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("bot", "Error connecting to server.");
        });
    }

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});

class Chatbot {
    constructor(config) {
      this.token = config.token;
      this.sessionId = null;
      this.csrfToken = this.getCsrfToken();
      this.botName = config.botName || "Chatbot";
      this.welcomeMessage =
        config.welcomeMessage || "Hello! How can I help you today?";
      this.primaryColor = config.primaryColor || "e06936";
      this.secondaryColor = config.secondaryColor || "f0f4f8";
      this.botImage = config.botImage || "https://via.placeholder.com/40";
  
      this.injectStyles();
      this.createChatbotHTML();
      this.initializeElements();
      console.log("Chatbot initialized with config:", config);
      this.init();
    }
  
    // init() {
    //   console.log("Initializing chatbot...");
    //   this.addEventListeners();
    // }
    init() {
      console.log("Initializing chatbot...");
      this.loadChatHistory();
      this.addEventListeners();
    }
  
    getCsrfToken() {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      console.log("Retrieved CSRF token:", csrfToken);
      return csrfToken || "";
    }
  
    getCSRFHeaders() {
      return {
        "Content-Type": "application/json",
        "X-CSRFToken": this.csrfToken,
      };
    }
  
    injectStyles() {
      const style = document.createElement("style");
      style.innerHTML = `
        :root {
          --primary-color: #${this.primaryColor};
          --secondary-color: #${this.secondaryColor};
        }
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          height: 500px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          background-color: white;
        }
        .chatbot-header {
          background-color: var(--primary-color);
          color: white;
          padding: 15px;
          font-weight: bold;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .chatbot-header-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .chatbot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid white;
        }
        .chatbot-title-status {
          display: flex;
          flex-direction: column;
        }
        .online-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #e0e0e0;
        }
        .online-dot {
          width: 8px;
          height: 8px;
          background-color: #4CAF50;
          border-radius: 50%;
        }
        .message-status {
          font-size: 11px;
          color: #888;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .chatbot-message {
          margin-bottom: 15px;
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 20px;
          font-size: 14px;
          line-height: 1.4;
          position: relative;
        }
        .user-message {
          background-color: var(--primary-color);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 5px;
        }
        .bot-message {
          background-color: var(--secondary-color);
          color: #333;
          align-self: flex-start;
          border-bottom-left-radius: 5px;
          padding-right: 35px;
        }
        .bot-icon {
          position: absolute;
          right: 5px;
          bottom: 5px;
          width: 20px;
          height: 20px;
          color: #666;
        }
        /* Rest of the existing styles... */
      `;
      document.head.appendChild(style);
    }
  
    createChatbotHTML() {
      const chatbotHTML = `
        <div class="chatbot-bubble" id="chatbot-bubble">
          <i class="fas fa-comments fa-lg"></i>
        </div>
        <div class="chatbot-container d-none" id="chatbot">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <img src="${this.botImage}" alt="${this.botName}" class="chatbot-avatar">
              <div class="chatbot-title-status">
                <span>${this.botName}</span>
                <div class="online-status">
                  <span class="online-dot"></span>
                  <i class="far fa-clock"></i>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <button class="btn btn-sm text-white" id="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="chatbot-body" id="chatbot-body">
            <div class="chatbot-message bot-message">
              ${this.welcomeMessage}
              <i class="fas fa-robot bot-icon"></i>
              <div class="message-status">
                <i class="fas fa-check"></i>
                Bot · Seen
              </div>
            </div>
            <div class="chatbot-typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <div class="chatbot-footer">
            <div class="chatbot-input">
              <input type="text" id="question-id" class="form-control" hidden />
              <input
                type="text"
                id="user-input"
                placeholder="Type your message..."
                class="form-control"
              />
              <button id="send-btn">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      `;
  
      const wrapper = document.createElement("div");
      wrapper.innerHTML = chatbotHTML;
      document.body.appendChild(wrapper.firstElementChild);
      document.body.appendChild(wrapper.lastElementChild);
    }
  
    initializeElements() {
      this.chatbot = document.getElementById("chatbot");
      this.chatbotBubble = document.getElementById("chatbot-bubble");
      this.closeBtn = document.getElementById("close-btn");
      this.chatbotBody = document.getElementById("chatbot-body");
      this.userInput = document.getElementById("user-input");
      this.sendBtn = document.getElementById("send-btn");
      this.typingIndicator = document.querySelector(".chatbot-typing");
    }
  
    // addEventListeners() {
    //   this.chatbotBubble.addEventListener("click", () => {
    //     this.chatbot.classList.remove("d-none");
    //     this.chatbotBubble.classList.add("d-none");
    //   });
  
    //   this.closeBtn.addEventListener("click", () => {
    //     this.chatbot.classList.add("d-none");
    //     this.chatbotBubble.classList.remove("d-none");
    //   });
  
    //   this.sendBtn.addEventListener("click", () => {
    //     const answer = this.userInput.value;
    //     if (answer) {
    //       this.addMessage(answer, "user-message");
    //       this.userInput.value = "";
    //     }
    //   });
    // }
  
    addEventListeners() {
      // Toggle between showing chatbot and bubble
      this.chatbotBubble.addEventListener("click", () => {
        this.openChat();
      });
  
      this.closeBtn.addEventListener("click", () => {
        this.closeChat();
      });
  
      // Send message when send button is clicked or Enter key is pressed
      this.sendBtn.addEventListener("click", () => this.handleSendMessage());
      this.userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.handleSendMessage();
      });
    }
  
    handleSendMessage() {
      const userMessage = this.userInput.value.trim();
      if (userMessage) {
        this.addMessage(userMessage, "user-message");
        this.userInput.value = "";
        this.showTypingIndicator();
  
        // Simulate bot response after a short delay
        setTimeout(() => {
          this.addMessage("Thanks for your message!", "bot-message");
          this.hideTypingIndicator();
        }, 1000);
      }
    }
  
    showTypingIndicator() {
      this.typingIndicator.style.display = "flex";
      this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
    }
  
    hideTypingIndicator() {
      this.typingIndicator.style.display = "none";
    }
  
    openChat() {
      this.chatbot.classList.remove("d-none"); // Show chatbot
      this.chatbotBubble.classList.add("d-none"); // Hide bubble
    }
  
    closeChat() {
      this.chatbot.classList.add("d-none"); // Hide chatbot
      this.chatbotBubble.classList.remove("d-none"); // Show bubble
    }
  
    // addMessage(message, className) {
    //   const messageElement = document.createElement("div");
    //   messageElement.classList.add("chatbot-message", className);
    //   messageElement.textContent = message;
    //   this.chatbotBody.insertBefore(messageElement, this.typingIndicator);
    //   this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
    // }
    addMessage(message, className) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("chatbot-message", className);
  
      // Create message content
      messageElement.textContent = message;
  
      // Add bot icon for bot messages
      if (className === "bot-message") {
        const botIcon = document.createElement("i");
        botIcon.className = "fas fa-robot bot-icon";
        messageElement.appendChild(botIcon);
      }
  
      // Add seen status
      const statusDiv = document.createElement("div");
      statusDiv.className = "message-status";
  
      const checkIcon = document.createElement("i");
      checkIcon.className = "fas fa-check";
      statusDiv.appendChild(checkIcon);
  
      if (className === "bot-message") {
        statusDiv.appendChild(document.createTextNode(" Bot · Seen"));
      } else {
        statusDiv.appendChild(document.createTextNode(" Seen"));
      }
  
      messageElement.appendChild(statusDiv);
  
      this.chatbotBody.insertBefore(messageElement, this.typingIndicator);
      this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
  
      // Save messages to localStorage
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      chatHistory.push({ message, className });
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  
    // Load chat history on startup
    loadChatHistory() {
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      chatHistory.forEach(({ message, className }) => {
        this.addMessage(message, className);
      });
    }
  }
  
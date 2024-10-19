class Chatbot {
  constructor(config) {
    this.token = config.token;
    this.sessionId = null;
    this.csrfToken = this.getCsrfToken();
    this.botName = config.botName || "Chatbot";
    this.welcomeMessage =
      config.welcomeMessage || "Hello! How can I help you today?";

    this.injectStyles(); // Inject CSS dynamically
    this.createChatbotHTML(); // Create the chatbot HTML
    this.initializeElements(); // Initialize elements
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
        --primary-color: #e06936;
        --secondary-color: #f0f4f8;
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
        padding: 10px 15px;
        font-weight: bold;
        display: flex;
        align-items: center;  /* Ensures vertical alignment */
        justify-content: space-between; /* Spaces out elements evenly */
      }
      .chatbot-header i {
        margin-right: 8px; /* Adds space between the icon and bot name */
      }
      .chatbot-header button {
        background: transparent;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
      }
      .chatbot-body {
        flex-grow: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
      }
      .chatbot-footer {
        padding: 10px;
        background-color: var(--secondary-color);
      }
      .chatbot-message {
        margin-bottom: 15px;
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 14px;
        line-height: 1.4;
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
      }
      .chatbot-input {
        display: flex;
        align-items: center;
      }
      .chatbot-input input {
        flex-grow: 1;
        border: none;
        padding: 10px;
        border-radius: 20px;
        margin-right: 10px;
      }
      .chatbot-input button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        cursor: pointer;
      }
      .chatbot-bubble {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      }
      .chatbot-bubble:hover {
        transform: scale(1.1);
      }
      .chatbot-typing {
        display: none;
        align-self: flex-start;
        background-color: var(--secondary-color);
        color: #333;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 14px;
        margin-bottom: 15px;
      }
      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #333;
        animation: wave 1.3s linear infinite;
      }
      .dot:nth-child(2) {
        animation-delay: -1.1s;
      }
      .dot:nth-child(3) {
        animation-delay: -0.9s;
      }
      @keyframes wave {
        0%, 60%, 100% {
          transform: initial;
        }
        30% {
          transform: translateY(-10px);
        }
      }
      .d-none {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <div class="chatbot-bubble" id="chatbot-bubble">
        <i class="fas fa-comments fa-lg"></i>
      </div>
      <div class="chatbot-container d-none" id="chatbot">
        <div class="chatbot-header d-flex justify-content-between align-items-center">
          <div>
            <i class="fas fa-robot me-2"></i>
            <span>${this.botName}</span>
          </div>
          <button class="btn btn-sm text-white" id="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="chatbot-body" id="chatbot-body">
          <div class="chatbot-message bot-message">${this.welcomeMessage}</div>
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
    messageElement.textContent = message;
    this.chatbotBody.insertBefore(messageElement, this.typingIndicator);
    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;

    // Save messages to localStorage (Optional)
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

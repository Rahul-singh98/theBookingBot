const CHATBOT_API_URL = "http://localhost:8001";
const CHATBOT_CHAT_SESSION_API_ENDPOINT = "/api/chats";
const CHATBOT_CHATBOT_API_ENDPOINT = "/api/chatbots";
const REQUEST_COOLDOWN = 1000;

class Chatbot {
  constructor(config) {
    // Check if instance already exists
    if (window.chatbotInstance) {
      console.warn(
        "Chatbot instance already exists, returning existing instance"
      );
      return window.chatbotInstance;
    }

    if (!config.token) {
      throw new Error("Token is required to initialize the chatbot");
    }
    this.token = config.token;
    this.sessionId = localStorage.getItem("chatbot_session_id");
    this.csrfToken = this.getCsrfToken();
    this.lastRequestTime = 0;
    this.isProcessingRequest = false;
    this.requestQueue = [];

    // Store instance globally
    window.chatbotInstance = this;

    this.initialize();
  }

  // Add request queue handling
  async processRequestQueue() {
    if (this.isProcessingRequest || this.requestQueue.length === 0) return;

    this.isProcessingRequest = true;
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - this.lastRequestTime;

    if (timeSinceLastRequest < REQUEST_COOLDOWN) {
      await new Promise((resolve) =>
        setTimeout(resolve, REQUEST_COOLDOWN - timeSinceLastRequest)
      );
    }

    try {
      const nextRequest = this.requestQueue.shift();
      await nextRequest();
    } finally {
      this.lastRequestTime = Date.now();
      this.isProcessingRequest = false;
      this.processRequestQueue();
    }
  }

  queueRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processRequestQueue();
    });
  }

  // Modified API calls to use request queue
  async startChatSession() {
    if (this.sessionId) {
      console.warn("Session already exists, skipping new session creation.");
      return;
    }
    try {
      this.showTypingIndicator();
      const response = await axios.post(
        `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.token}`
      );
      console.log("ChatbotSession Response", response.data);
      this.sessionId = response.data.id;
      localStorage.setItem("chatbot_session_id", this.sessionId);
      await this.fetchNextQuestion();
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage(
        "Error starting session. Please try again.",
        "bot-message"
      );
      console.error("Session start error:", error);
    }
  }

  async fetchNextQuestion() {
    if (!this.sessionId) {
      console.error("No active session");
      return;
    }

    try {
      // this.showTypingIndicator();
      // const response = axios.get(
      //   `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.sessionId}/next-question`
      // );
      // console.log("nextquestion response", response.data);
      // this.hideTypingIndicator();
      // this.renderQuestion(response.data);
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage("Error fetching the next question.", "bot-message");
      console.error("Question fetch error:", error);
    }
  }

  async submitAnswer(answer, questionId) {
    if (!answer || !this.sessionId) return;

    try {
      this.addMessage(answer, "user-message");
      this.showTypingIndicator();

      const response = await axios.post(
        `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.sessionId}/submit-answer`,
        {
          answer,
          question_id: questionId,
        }
      );

      this.hideTypingIndicator();

      if (response.data.is_complete) {
        this.addMessage("Thank you! The session is complete.", "bot-message");
        this.sessionId = null; // Clear session
      } else {
        await this.fetchNextQuestion();
      }
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage("Error submitting answer.", "bot-message");
      console.error("Answer submission error:", error);
    }
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log("Initializing chatbot...");
      await this.configureChatbot();
      this.injectStyles();
      this.createChatbotHTML();
      this.initializeElements();
      this.addEventListeners();
      // this.loadChatHistory(); // Load chat history on initialization
      this.isInitialized = true;

      // If there's a session ID but no visible chat history, fetch the last state
      if (this.sessionId && !this.hasChatHistory()) {
        console.log("It must load the session");
        // await this.restoreSession();
      }
    } catch (error) {
      console.error("Failed to initialize chatbot:", error);
    }
  }

  hasChatHistory() {
    const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
    return history.length > 0;
  }

  async restoreSession() {
    try {
      // Fetch the current state of the session
      const response = await axios.get(
        `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.sessionId}/state`
      );

      // Restore messages from the session
      const messages = response.data.messages || [];
      messages.forEach((msg) => {
        this.addMessage(
          msg.content,
          msg.type === "user" ? "user-message" : "bot-message"
        );
      });

      // Fetch next question if session isn't complete
      if (!response.data.is_complete) {
        await this.fetchNextQuestion();
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      // If restoration fails, start a new session
      this.sessionId = null;
      localStorage.removeItem("chatbot_session_id");
      localStorage.removeItem("chatHistory");
    }
  }

  getCsrfToken() {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    return csrfToken || "";
  }

  async configureChatbot() {
    try {
      const response = await axios.get(
        `${CHATBOT_API_URL}${CHATBOT_CHATBOT_API_ENDPOINT}/${this.token}`
      );
      const config = response.data;
      console.log("Chatbot Data", response.data);
      this.botName = config.name || "Chatbot";
      this.welcomeMessage =
        config.welcome_message || "Hello! How can I help you today?";
      this.primaryColor = config.primary_color || "e06936";
      this.secondaryColor = config.secondary_color || "f0f4f8";
      this.botImage = config.bot_image || "https://via.placeholder.com/40";
    } catch (error) {
      console.error("Failed to fetch chatbot configuration:", error);
      // Use default values if configuration fails
      this.botName = "Chatbot";
      this.welcomeMessage = "Hello! How can I help you today?";
      this.primaryColor = "e06936";
      this.secondaryColor = "f0f4f8";
      this.botImage = "https://via.placeholder.com/40";
    }
  }

  injectStyles() {
    if (!document.getElementById("chatbot-styles")) {
      const style = document.createElement("style");
      style.id = "chatbot-styles";
      style.innerHTML = `
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
              z-index: 9999;
            }
            .chatbot-header {
              background-color: #${this.primaryColor};
              color: white;
              padding: 10px 15px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .chatbot-header i {
              margin-right: 8px; 
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
              background-color: #${this.secondaryColor};
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
              background-color: #${this.primaryColor};
              color: white;
              align-self: flex-end;
              border-bottom-right-radius: 5px;
            }
            .bot-message {
              background-color: #${this.secondaryColor};
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
              background-color: #${this.primaryColor};
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
              background-color: #${this.primaryColor};
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
              background-color: #${this.secondaryColor};
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
  }

  createChatbotHTML() {
    const chatbotHTML = `
          <div class="chatbot-bubble" id="chatbot-bubble">
            <i class="fas fa-comments fa-lg"></i>
          </div>
          <div class="chatbot-container d-none" id="chatbot">
            <div class="chatbot-header">
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
    this.chatbotBubble.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!this.sessionId) {
        await this.startChatSession();
      }
      this.openChat();
    });

    // this.closeBtn.addEventListener("click", () => {
    //   this.closeChat();
    // });

    // Send message when send button is clicked or Enter key is pressed
    // this.sendBtn.addEventListener("click", () => this.handleSendMessage());
    // this.userInput.addEventListener("keypress", (e) => {
    //   if (e.key === "Enter") this.handleSendMessage();
    // });
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
  addMessage(message, className, saveToStorage = true) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chatbot-message", className);
    messageElement.textContent = message;

    // Add bot icon for bot messages
    if (className === "bot-message") {
      const botIcon = document.createElement("i");
      botIcon.className = "fas fa-robot bot-icon";
      messageElement.appendChild(botIcon);
    }

    // Add message status
    const statusDiv = document.createElement("div");
    statusDiv.className = "message-status";
    statusDiv.appendChild(
      document.createTextNode(
        className === "bot-message" ? " Bot · Seen" : " Seen"
      )
    );
    messageElement.appendChild(statusDiv);

    this.chatbotBody.insertBefore(messageElement, this.typingIndicator);
    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;

    // Save to localStorage if needed
    if (saveToStorage) {
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      chatHistory.push({ message, className });
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }

  // Load chat history on startup
  loadChatHistory() {
    try {
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      this.chatbotBody.innerHTML = ""; // Clear existing messages
      chatHistory.forEach(({ message, className }) => {
        this.addMessage(message, className, false); // Don't save to storage while loading
      });
      // Re-add typing indicator after loading history
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "chatbot-typing";
      typingIndicator.innerHTML =
        '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
      this.chatbotBody.appendChild(typingIndicator);
      this.typingIndicator = typingIndicator;
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }

  renderQuestion(data) {
    const { question, question_id, response_type, options = [], filler } = data;

    this.addMessage(question, "bot-message");

    if (question_id) {
      this.replaceQuestionId(question_id);
    }

    const inputContainer = document.querySelector(".chatbot-input");
    const oldInput = document.getElementById("user-input");
    let newInput;

    switch (response_type) {
      case "dropdown":
        newInput = this.createDropdown(options);
        break;
      case "clicklist":
        this.createClickList(options, question_id);
        return; // Early return as clicklist doesn't need input replacement
      case "datetime":
      case "address":
      case "number":
      case "phone":
      case "email":
        newInput = this.createInput(response_type);
        break;
      default:
        newInput = this.createInput("text");
    }

    if (newInput) {
      inputContainer.replaceChild(newInput, oldInput);
    }

    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
  }

  createInput(type) {
    const input = document.createElement("input");
    input.id = "user-input";
    input.classList.add("form-control");
    input.type = type;
    input.placeholder = `Type your ${
      type === "datetime-local" ? "date" : type
    }...`;
    return input;
  }

  createDropdown(options) {
    const select = document.createElement("select");
    select.id = "user-input";
    select.classList.add("form-control");

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    return select;
  }

  createClickList(options, questionId) {
    const clickListWrapper = document.createElement("div");
    clickListWrapper.classList.add("chatbot-clicklist");

    options.forEach((option) => {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-outline-primary", "m-1");
      button.textContent = option;
      button.addEventListener("click", () =>
        this.submitAnswer(option, questionId)
      );
      clickListWrapper.appendChild(button);
    });

    this.chatbotBody.insertBefore(clickListWrapper, this.typingIndicator);
  }

  //   handleSendMessage() {
  //     const userMessage = this.userInput.value.trim();
  //     if (userMessage) {
  //       this.addMessage(userMessage, "user-message");
  //       this.userInput.value = "";
  //       this.showTypingIndicator();

  //       // Simulate bot response after a short delay
  //       setTimeout(() => {
  //         this.addMessage("Thanks for your message!", "bot-message");
  //         this.hideTypingIndicator();
  //       }, 1000);
  //     }
  //   }

  async handleSendMessage() {
    const input = document.getElementById("user-input");
    const questionId = document.getElementById("question-id").value;
    const answer = input.value.trim();

    if (answer) {
      await this.submitAnswer(answer, questionId);
      input.value = "";
    }
  }
}

const initChatbot = (token) => {
  return window.chatbotInstance || new Chatbot({ token });
};

window.initChatbot = initChatbot;
window.Chatbot = Chatbot;

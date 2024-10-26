const CHATBOT_API_URL = "http://localhost:8001";
const CHATBOT_CHAT_SESSION_API_ENDPOINT = "/api/chats";
const CHATBOT_CHATBOT_API_ENDPOINT = "/api/chatbots";

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

    // Store instance globally
    window.chatbotInstance = this;

    this.initialize();
  }

  async startChatSession() {
    if (this.sessionId) {
      console.warn("Session already exists, skipping new session creation.");
      return;
    }
    try {
      this.showTypingIndicator();
      const response = await $.post(
        `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.token}`
      );
      console.log("ChatbotSession Response", response);
      this.sessionId = response.id;
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
      const response = await $.get(
        `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.sessionId}/next-question`
      );
      this.hideTypingIndicator();
      this.renderQuestion(response);
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

      const response = await $.post(
        `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.sessionId}/submit-answer`,
        {
          answer,
          question_id: questionId,
        }
      );

      this.hideTypingIndicator();

      if (response.is_complete) {
        this.addMessage("Thank you! The session is complete.", "bot-message");
        this.sessionId = null;
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
    if (this.isInitialized) return;

    try {
      console.log("Initializing chatbot...");
      await this.configureChatbot();
      this.injectStyles();
      this.createChatbotHTML();
      this.initializeElements();
      this.addEventListeners();
      this.isInitialized = true;

      if (this.sessionId && !this.hasChatHistory()) {
        await this.restoreSession();
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
      const response = await $.get(
        `${CHATBOT_API_URL}${CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${this.sessionId}/state`
      );

      const messages = response.messages || [];
      messages.forEach((msg) => {
        this.addMessage(
          msg.content,
          msg.type === "user" ? "user-message" : "bot-message"
        );
      });

      if (!response.is_complete) {
        await this.fetchNextQuestion();
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      this.sessionId = null;
      localStorage.removeItem("chatbot_session_id");
      localStorage.removeItem("chatHistory");
    }
  }

  getCsrfToken() {
    return $('meta[name="csrf-token"]').attr("content") || "";
  }

  async configureChatbot() {
    try {
      const config = await $.get(
        `${CHATBOT_API_URL}${CHATBOT_CHATBOT_API_ENDPOINT}/${this.token}`
      );
      this.botName = config.name || "Chatbot";
      this.welcomeMessage =
        config.welcome_message || "Hello! How can I help you today?";
      this.primaryColor = config.primary_color || "e06936";
      this.secondaryColor = config.secondary_color || "f0f4f8";
      this.botImage = config.bot_image || "https://via.placeholder.com/40";
    } catch (error) {
      console.error("Failed to fetch chatbot configuration:", error);
      this.botName = "Chatbot";
      this.welcomeMessage = "Hello! How can I help you today?";
      this.primaryColor = "e06936";
      this.secondaryColor = "f0f4f8";
      this.botImage = "https://via.placeholder.com/40";
    }
  }

  injectStyles() {
    if (!$("#chatbot-styles").length) {
      $("<style>")
        .attr("id", "chatbot-styles")
        .html(
          `
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
        `
        )
        .appendTo("head");
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
            <input type="text" id="user-input" placeholder="Type your message..." class="form-control" />
            <button id="send-btn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    $(chatbotHTML).appendTo("body");
  }

  initializeElements() {
    this.$chatbot = $("#chatbot");
    this.$chatbotBubble = $("#chatbot-bubble");
    this.$closeBtn = $("#close-btn");
    this.$chatbotBody = $("#chatbot-body");
    this.$userInput = $("#user-input");
    this.$sendBtn = $("#send-btn");
    this.$typingIndicator = $(".chatbot-typing");
  }

  addEventListeners() {
    this.$chatbotBubble.on("click", async (e) => {
      e.preventDefault();
      if (!this.sessionId) {
        await this.startChatSession();
      }
      this.openChat();
    });

    this.$closeBtn.on("click", () => this.closeChat());

    this.$sendBtn.on("click", () => this.handleSendMessage());
    this.$userInput.on("keypress", (e) => {
      if (e.key === "Enter") this.handleSendMessage();
    });
  }

  showTypingIndicator() {
    this.$typingIndicator.show();
    this.$chatbotBody.scrollTop(this.$chatbotBody[0].scrollHeight);
  }

  hideTypingIndicator() {
    this.$typingIndicator.hide();
  }

  openChat() {
    this.$chatbot.removeClass("d-none");
    this.$chatbotBubble.addClass("d-none");
  }

  closeChat() {
    this.$chatbot.addClass("d-none");
    this.$chatbotBubble.removeClass("d-none");
  }

  addMessage(message, className, saveToStorage = true) {
    const $messageElement = $("<div>")
      .addClass(`chatbot-message ${className}`)
      .text(message);

    if (className === "bot-message") {
      $("<i>").addClass("fas fa-robot bot-icon").appendTo($messageElement);
    }

    const $statusDiv = $("<div>")
      .addClass("message-status")
      .text(className === "bot-message" ? " Bot · Seen" : " Seen");

    $messageElement.append($statusDiv);

    $messageElement.insertBefore(this.$typingIndicator);
    this.$chatbotBody.scrollTop(this.$chatbotBody[0].scrollHeight);

    if (saveToStorage) {
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      chatHistory.push({ message, className });
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
  }

  loadChatHistory() {
    try {
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
      this.$chatbotBody.empty();
      chatHistory.forEach(({ message, className }) => {
        this.addMessage(message, className, false);
      });

      const $typingIndicator = $("<div>")
        .addClass("chatbot-typing")
        .html(
          '<span class="dot"></span><span class="dot"></span><span class="dot"></span>'
        );

      this.$chatbotBody.append($typingIndicator);
      this.$typingIndicator = $typingIndicator;
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }

  renderQuestion(data) {
    const { question, question_id, response_type, options = [] } = data;

    this.addMessage(question, "bot-message");

    if (question_id) {
      $("#question-id").val(question_id);
    }

    const $inputContainer = $(".chatbot-input");
    const $oldInput = $("#user-input");
    let $newInput;

    switch (response_type) {
      case "dropdown":
        $newInput = this.createDropdown(options);
        break;
      case "clicklist":
        this.createClickList(options, question_id);
        return;
      case "datetime":
      case "address":
      case "number":
      case "phone":
      case "email":
        $newInput = this.createInput(response_type);
        break;
      default:
        $newInput = this.createInput("text");
    }

    if ($newInput) {
      $oldInput.replaceWith($newInput);
    }

    this.$chatbotBody.scrollTop(this.$chatbotBody[0].scrollHeight);
  }

  createInput(type) {
    return $("<input>")
      .attr({
        id: "user-input",
        type: type,
        placeholder: `Type your ${
          type === "datetime-local" ? "date" : type
        }...`,
      })
      .addClass("form-control");
  }

  createDropdown(options) {
    const $select = $("<select>")
      .attr("id", "user-input")
      .addClass("form-control");

    options.forEach((option) => {
      $("<option>").val(option).text(option).appendTo($select);
    });

    return $select;
  }

  createClickList(options, questionId) {
    const $clickListWrapper = $("<div>").addClass("chatbot-clicklist");

    options.forEach((option) => {
      $("<button>")
        .addClass("btn btn-outline-primary m-1")
        .text(option)
        .on("click", () => this.submitAnswer(option, questionId))
        .appendTo($clickListWrapper);
    });

    $clickListWrapper.insertBefore(this.$typingIndicator);
  }

  async handleSendMessage() {
    const answer = $("#user-input").val().trim();
    const questionId = $("#question-id").val();

    if (answer) {
      await this.submitAnswer(answer, questionId);
      $("#user-input").val("");
    }
  }
}

const initChatbot = (token) => {
  return window.chatbotInstance || new Chatbot({ token });
};

window.initChatbot = initChatbot;
window.Chatbot = Chatbot;

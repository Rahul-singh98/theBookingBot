class Chatbot {
  constructor(config) {
    this.token = config.token;
    this.sessionId = null;
    this.csrfToken = this.getCsrfToken();
    this.botName = config.botName || "Chatbot";
    this.welcomeMessage =
      config.welcomeMessage || "Hello! How can I help you today?";

    this.createChatbotHTML();
    this.initializeElements();

    console.log("Chatbot initialized with config:", config);
    this.init();
  }

  init() {
    console.log("Initializing chatbot...");
    this.addEventListeners();
  }

  // Retrieve CSRF token from meta tag
  getCsrfToken() {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    console.log("Retrieved CSRF token:", csrfToken);
    return csrfToken;
  }

  getCSRFHeaders() {
    return {
      "Content-Type": "application/json",
      "X-CSRFToken": this.csrfToken,
    };
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

    // Create a wrapper element and set its innerHTML
    const wrapper = document.createElement("div");
    wrapper.innerHTML = chatbotHTML;

    // Append the chatbot elements to the body
    document.body.appendChild(wrapper.firstElementChild); // Append bubble
    document.body.appendChild(wrapper.lastElementChild); // Append container
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

  addEventListeners() {
    console.log("Adding event listeners...");

    // When chatbot bubble is clicked, start the session
    this.chatbotBubble.addEventListener("click", () => {
      console.log("Chatbot bubble clicked");
      this.chatbot.classList.remove("d-none");
      this.chatbotBubble.classList.add("d-none");
      if (this.sessionId === null) {
        this.startChatSession();
      }
    });

    // Close chatbot event
    this.closeBtn.addEventListener("click", () => {
      console.log("Closing chatbot...");
      this.chatbot.classList.add("d-none");
      this.chatbotBubble.classList.remove("d-none");
    });

    // Submit answer
    this.sendBtn.addEventListener("click", () => {
      const inputElement = document.getElementById("user-input");
      const answer = inputElement.value;
      const questionIdElement = document.getElementById("question-id");
      const question_id = questionIdElement.value;

      console.log("Sending answer:", answer);
      if (answer) {
        this.fetchNextQuestion(answer, question_id);
      }
    });
  }

  // Start chat session
  startChatSession() {
    console.log("Starting new chat session...");
    this.showTypingIndicator();
    fetch(`/chat/start-session/${this.token}/`, {
      method: "POST",
      headers: this.getCSRFHeaders(),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Session started:", data);
        this.sessionId = data.session_id;
        this.hideTypingIndicator();
        this.renderQuestion(data);
      })
      .catch((error) => {
        console.error("Error starting session:", error);
        this.hideTypingIndicator();
        this.addMessage(
          "Error starting session. Please try again.",
          "bot-message"
        );
      });
  }

  // Fetch next question
  fetchNextQuestion(answer, question_id) {
    console.log("Fetching next question...");
    if (answer) {
      this.addMessage(answer, "user-message");
      this.showTypingIndicator();

      fetch(`/chat/next-question/${this.sessionId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer, question_id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Answer submitted. Next data:", data);
          this.hideTypingIndicator();
          if (data.is_completed) {
            this.addMessage(
              "Thank you! The session is complete.",
              "bot-message"
            );
          } else {
            this.renderQuestion(data);
          }
        })
        .catch((error) => {
          console.error("Error submitting answer:", error);
          this.hideTypingIndicator();
          this.addMessage("Error submitting answer.", "bot-message");
        });
    }
  }

  submitAnswer(answer, question_id) {
    console.log("Submitting answer:", answer);
    if (answer) {
      this.addMessage(answer, "user-message");
      this.showTypingIndicator();

      fetch(`/chat/next-question/${this.sessionId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer, question_id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Answer submitted. Next data:", data);
          this.hideTypingIndicator();
          if (data.is_complete) {
            this.addMessage(
              "Thank you! The session is complete.",
              "bot-message"
            );
          } else {
            this.renderQuestion(data);
          }
        })
        .catch((error) => {
          console.error("Error submitting answer:", error);
          this.hideTypingIndicator();
          this.addMessage("Error submitting answer.", "bot-message");
        });
    }
  }

  // Render the question
  renderQuestion(data) {
    console.log("Rendering question:", data);
    const question = data.question;
    const question_id = data.question_id;
    const inputType = data.response_type;
    const options = data.options || [];

    this.addMessage(question, "bot-message");

    if (question_id !== null) {
      this.replaceQuestionId(question_id);
    }

    let inputElement;
    switch (inputType) {
      case "dropdown":
        inputElement = this.replaceInputWithDropdown(options);
        break;
      case "clicklist":
        inputElement = this.createClickList(options, question_id);
        break;
      case "datetime":
        inputElement = this.replaceInputFieldWith("datetime-local");
        break;
      case "address":
        inputElement = this.replaceInputFieldWith("address");
        break;
      case "number":
        inputElement = this.replaceInputFieldWith("number");
        break;
      case "phone":
        inputElement = this.replaceInputFieldWith("tel");
        break;
      case "email":
        inputElement = this.replaceInputFieldWith("email");
        break;
      default:
        inputElement = this.replaceInputFieldWith("text");
        break;
    }

    console.log("Question rendered with input type:", inputType);
    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
  }

  replaceQuestionId(question_id) {
    console.log("Replacing question ID:", question_id);
    const questionIdEle = document.getElementById("question-id");
    questionIdEle.value = question_id;
  }

  replaceInputFieldWith(type) {
    console.log("Replacing input field with type:", type);
    const inputContainer = document.querySelector(".chatbot-input");
    const oldInput = document.getElementById("user-input");

    const userInput = document.createElement("input");
    userInput.id = "user-input";
    userInput.classList.add("form-control");
    userInput.type = type;
    userInput.value = "";
    userInput.placeholder = `Type your ${
      type === "datetime-local" ? "date" : type
    }...`;

    inputContainer.replaceChild(userInput, oldInput);
  }

  replaceInputWithDropdown(options) {
    console.log("Replacing input with dropdown:", options);
    const inputContainer = document.querySelector(".chatbot-input");
    const oldInput = document.getElementById("user-input");

    const select = document.createElement("select");
    select.id = "user-input";
    select.classList.add("form-control");

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    inputContainer.replaceChild(select, oldInput);
  }

  createClickList(options, question_id) {
    console.log("Creating click list with options:", options);
    const clickListWrapper = document.createElement("div");
    clickListWrapper.classList.add("chatbot-clicklist");

    options.forEach((option) => {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-outline-primary", "m-1");
      button.textContent = option;
      button.addEventListener("click", () => {
        console.log("Click list option clicked:", option);
        this.fetchNextQuestion(option, question_id);
      });
      clickListWrapper.appendChild(button);
    });

    this.chatbotBody.insertBefore(clickListWrapper, this.typingIndicator);
    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
  }

  // Helper methods for showing messages and typing indicator
  addMessage(message, className) {
    console.log("Adding message:", message);
    const messageElement = document.createElement("div");
    messageElement.classList.add("chatbot-message", className);
    messageElement.textContent = message;
    this.chatbotBody.insertBefore(messageElement, this.typingIndicator);
    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
  }

  showTypingIndicator() {
    console.log("Showing typing indicator...");
    this.typingIndicator.style.display = "block";
    this.chatbotBody.scrollTop = this.chatbotBody.scrollHeight;
  }

  hideTypingIndicator() {
    console.log("Hiding typing indicator...");
    this.typingIndicator.style.display = "none";
  }
}

// <style>
// #chatbot-bubble {
// /* Your bubble button styles */
// }

// .chatbot-message {
// /* Styles for chatbot messages */
// }

// /* Customize typing indicator */
// .chatbot-typing {
// display: none;
// /* Your styles for typing indicator */
// }

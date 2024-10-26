// Configuration constants
const BACKEND_CHATBOT_API_URL = "http://localhost:8001";
const BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT = "/api/chats";
const BACKEND_CHATBOT_CHATBOT_API_ENDPOINT = "/api/chatbots";

// State management
const clientBotState = {
  token: null,
  sessionId: null,
  botName: "Chatbot",
  welcomeMessage: "Hello! How can I help you today?",
  primaryColor: "e06936",
  secondaryColor: "f0f4f8",
  botImage: `${BACKEND_CHATBOT_API_URL}/static/images/bot.svg`,
  elements: {},
  current: {
    questionId: null,
    question: null,
  },
};

// Initialize the chatbot
const initChatbot = async (config) => {
  if (window.chatbotInstance) {
    console.warn("Chatbot instance already exists");
    return window.chatbotInstance;
  }

  if (!config.token) {
    throw new Error("Token is required to initialize the chatbot");
  }

  clientBotState.token = config.token;
  clientBotState.sessionId = localStorage.getItem("chatbot_session_id");

  try {
    await loadDependencies();
    await configureChatbot();
    injectStyles();
    createChatbotHTML();
    initializeElements();
    addEventListeners();

    // Check visibility state in localStorage
    const isVisible = localStorage.getItem("chatbot_visible") === "true";
    if (isVisible) {
      openChat();
    } else {
      closeChat();
    }

    if (clientBotState.sessionId) {
      loadChatHistory();
    }

    window.chatbotInstance = { initialized: true };
    return window.chatbotInstance;
  } catch (error) {
    console.error("Failed to initialize chatbot:", error);
  }
};

// Load jQuery dependency
const loadDependencies = () => {
  return new Promise((resolve, reject) => {
    if (window.jQuery) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load jQuery"));
    document.head.appendChild(script);

    // const googleScript = document.createElement("script");
    // googleScript.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places`;
    // googleScript.async = true;
    // googleScript.onload = resolve;
    // googleScript.onerror = () =>
    //   reject(new Error("Failed to load Google Places API"));
    // document.head.appendChild(googleScript);
  });
};

// Configure chatbot settings
const configureChatbot = async () => {
  try {
    const config = await $.get(
      `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHATBOT_API_ENDPOINT}/${clientBotState.token}`
    );
    clientBotState.botName = config.name || clientBotState.botName;
    clientBotState.welcomeMessage =
      config.welcome_message || clientBotState.welcomeMessage;
    clientBotState.primaryColor =
      config.primary_color || clientBotState.primaryColor;
    clientBotState.secondaryColor =
      config.secondary_color || clientBotState.secondaryColor;
    clientBotState.botImage = config.bot_image || clientBotState.botImage;
  } catch (error) {
    console.error("Failed to fetch chatbot configuration:", error);
  }
};

// Inject required styles
const injectStyles = () => {
  const cssUrl = `${BACKEND_CHATBOT_API_URL}/static/css/chatbot-styles.css`;

  if (!$("#chatbot-styles").length) {
    fetch(cssUrl)
      .then((response) => response.text())
      .then((css) => {
        const updatedCss = css
          .replace(/--primary-color/g, `#${clientBotState.primaryColor}`)
          .replace(/--secondary-color/g, `#${clientBotState.secondaryColor}`);
        $("<style>")
          .attr("id", "chatbot-styles")
          .html(updatedCss)
          .appendTo("head");
      })
      .catch((error) => console.error("Error loading chatbot styles:", error));
  }
};

// Create chatbot HTML structure
// Create chatbot HTML structure
const createChatbotHTML = () => {
  const chatbotHTML = `
    <div class="boticonchat-cover">
      <div class="chat-box-fixicon" tabindex="0" role="button" aria-label="Open Chatbot">
        <img class="chat-box" src="${BACKEND_CHATBOT_API_URL}/static/images/chat-bot.svg" />
      </div>
      <div class="chat-wrap boxHide">
        <div class="chat-head">
          <div class="ch-left">
            <span>${clientBotState.botName}</span>
            <div class="chat-active">
              <img src="${BACKEND_CHATBOT_API_URL}/static/images/time.svg" />
              <span>A few minutes</span>
            </div>
          </div>
          <div class="ch-right">
            <div class="refresh-chat-box" tabindex="0" role="button" aria-label="Refresh Chatbot">
              <img src="${BACKEND_CHATBOT_API_URL}/static/images/refresh.svg" />
            </div>
            <div class="close-chat-box" tabindex="0" role="button" aria-label="Close Chatbot">
              <img src="${BACKEND_CHATBOT_API_URL}/static/images/cross.svg" />
            </div>
          </div>
        </div>
        <div class="chating-wrapper"></div>
        <div class="chat-footer">
          <input type="text" placeholder="Type a reply..." />
          <div tabindex="0" role="button" aria-label="Send Message">
            <img src="${BACKEND_CHATBOT_API_URL}/static/images/send.svg" />
          </div>
        </div>
      </div>
    </div>
  `;

  $(chatbotHTML).appendTo("body");
};

// Initialize DOM elements
const initializeElements = () => {
  clientBotState.elements = {
    chatbox: $(".chat-wrap"),
    chatboxIcon: $(".chat-box-fixicon"),
    closeBtn: $(".close-chat-box"),
    chatBody: $(".chating-wrapper"),
    userInput: $(".chat-footer input"),
    sendBtn: $(".chat-footer div[role='button'][aria-label='Send Message']"),
    typingIndicator: $(".typing-indicator"),
  };

  $(".ch-left span:first").text(clientBotState.botName);
};

// Add event listeners
const addEventListeners = () => {
  clientBotState.elements.chatboxIcon.on("click", handleChatboxClick);
  clientBotState.elements.closeBtn.on("click", closeChat);
  clientBotState.elements.sendBtn.on("click", handleSendMessage);
  clientBotState.elements.userInput.on("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
  });

  // New: Refresh button event
  $(".refresh-chat-box").on("click", refreshChatbot);
};

// Handle chatbox icon click
const handleChatboxClick = async (event) => {
  event.preventDefault();
  event.stopPropagation();

  if (!clientBotState.sessionId) {
    try {
      await startChatSession();
      openChat();
    } catch (error) {
      console.error("Failed to start chat session:", error);
    }
  } else {
    openChat();
  }
};

// Start new chat session
const startChatSession = async () => {
  if (clientBotState.sessionId) {
    return clientBotState.sessionId;
  }

  showTypingIndicator();

  try {
    const response = await $.ajax({
      url: `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${clientBotState.token}`,
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    if (!response || !response.id) {
      throw new Error("Invalid session response");
    }

    clientBotState.sessionId = response.id;
    localStorage.setItem("chatbot_session_id", clientBotState.sessionId);

    hideTypingIndicator();
    addMessage(clientBotState.welcomeMessage, "bot");
    await fetchNextQuestion();

    return clientBotState.sessionId;
  } catch (error) {
    hideTypingIndicator();
    addMessage("Error starting session. Please try again.", "bot", false);
    throw error;
  }
};

// Fetch next question
const fetchNextQuestion = async () => {
  if (!clientBotState.sessionId) {
    console.error("No active session");
    return;
  }

  try {
    const response = await $.get(
      `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${clientBotState.sessionId}/next-question`
    );
    hideTypingIndicator();
    addMessage(response.question, "bot", response);
  } catch (error) {
    hideTypingIndicator();
    addMessage("Error fetching the next question.", "bot");
    console.error("Error fetching question:", error);
  }
};

// Submit answer
const submitAnswer = async (answer, answerText) => {
  if (!answer || !clientBotState.sessionId) return;

  addMessage(answerText, "user");
  showTypingIndicator();

  try {
    const response = await $.ajax({
      url: `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${clientBotState.sessionId}/answer`,
      method: "POST",
      contentType: "application/json", // Ensures JSON format
      dataType: "json",
      data: JSON.stringify({
        answer,
        question_id: clientBotState.current.questionId,
        question: clientBotState.current.question,
      }), // Stringify the data
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    hideTypingIndicator();

    if (response.is_complete) {
      addMessage("Thank you! The session is complete.", "bot");
    } else {
      await fetchNextQuestion();
    }
  } catch (error) {
    hideTypingIndicator();
    addMessage("Error submitting answer.", "bot");
    console.error("Answer submission error:", error);
  }
};

// Handle send message
// const handleSendMessage = () => {
//   const answer = $("#user-input").val().trim();
//   const answerText = $("#user-input").text().trim();
//   const questionId = $("#question-id").val();

//   if (answer) {
//     submitAnswer(answer, answerText, questionId);
//     $("#user-input").val("");
//   }
// };

const handleSendMessage = async () => {
  const inputElement = clientBotState.elements.userInput;
  let answer = "";
  let answerText = "";

  // Determine input type and get answer accordingly
  if (inputElement.is("input") || inputElement.is("textarea")) {
    answer = inputElement.val().trim();
    answerText = answer;
  } else if (inputElement.is("select")) {
    answer = inputElement.val();
    answerText = inputElement.find("option:selected").text();
  } else if (inputElement.hasClass("chatbot-clicklist")) {
    console.warn("Use buttons in the clicklist to select an answer");
    return;
  }

  // Only proceed if an answer was provided
  if (answer) {
    await submitAnswer(answer, answerText);
    inputElement.val(""); // Clear input for next message
  }
};

// Add message to chat
const addMessage = (
  message,
  messageBy = "bot",
  inputData = null,
  saveToStorage = true
) => {
  const timestamp = new Date(); // Get the current timestamp
  const className =
    messageBy === "user" ? "user-chat chat-right" : "bot-chat chat-left";
  const imageHtml =
    messageBy === "bot" ? `<img src="${clientBotState.botImage}" />` : "";

  const messageHTML = `
    <div class="chatbot-message ${className}">
      <div class="chat-cover">
        ${imageHtml}
        <div class="chattxt-chattime-wrap">
          <div class="chattxt"><p>${message}</p></div>
          <div class="chat-time" data-timestamp="${timestamp}">${getRelativeTime(
    timestamp
  )}</div>
        </div>
      </div>
    </div>
  `;

  clientBotState.elements.chatBody.append(messageHTML);
  clientBotState.elements.chatBody.scrollTop(
    clientBotState.elements.chatBody[0].scrollHeight
  );

  if (inputData !== null) {
    renderInput(inputData);
  }

  if (saveToStorage) {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ message, messageBy, inputData, timestamp });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }
};

// Render input based on type
const renderInput = (data) => {
  const { question, question_id, response_type, options = [] } = data;
  clientBotState.current.question = question;
  clientBotState.current.questionId = question_id;

  if (question_id) {
    $("#question-id").val(question_id);
  }

  let inputHtml = "";

  switch (response_type) {
    case "dropdown":
      inputHtml = createDropdown(options);
      break;
    case "clicklist":
      createClickList(options, question_id);
      return;
    case "datetime":
      inputHtml = createInput("datetime-local");
      break;
    case "address":
      inputHtml = createInput("text", "Type your address...");
      break;
    case "number":
      inputHtml = createInput("number", "Enter a number...");
      break;
    case "phone":
      inputHtml = createInput("tel", "Enter your phone number...");
      break;
    case "email":
      inputHtml = createInput("email", "Enter your email...");
      break;
    default:
      inputHtml = createInput("text", "Type your response...");
  }

  clientBotState.elements.userInput.replaceWith(inputHtml);
  clientBotState.elements.userInput = $("#user-input");
};

// Create input element
const createInput = (type, placeholder = "Type your response...") => {
  return `<input id="user-input" type="${type}" placeholder="${placeholder}" class="form-control">`;
};

// Create dropdown element
const createDropdown = (options) => {
  const optionsHtml = options
    .map((option) => `<option value="${option.order}">${option.text}</option>`)
    .join("");
  return `
    <select id="user-input" class="form-control">
      <option value="">Select</option>
      ${optionsHtml}
    </select>
  `;
};

// Create clickable list
const createClickList = (options, questionId) => {
  const $wrapper = $("<div>").addClass("chatbot-clicklist");

  options.forEach((option) => {
    $("<button>")
      .addClass("btn btn-outline-primary m-1")
      .text(option)
      .on("click", async () => await submitAnswer(option, option))
      .appendTo($wrapper);
  });

  $wrapper.insertBefore(clientBotState.elements.typingIndicator);
};

// Show typing indicator
const showTypingIndicator = () => {
  const typingHTML = `
    <div class="bot-chat chat-left typing-indicator">
      <div class="chat-cover">
        <img src="${clientBotState.botImage}" />
        <div class="chattxt-chattime-wrap">
          <div class="chattxt"><p>typing...</p></div>
        </div>
      </div>
    </div>
  `;
  clientBotState.elements.chatBody.append(typingHTML);
  clientBotState.elements.chatBody.scrollTop(
    clientBotState.elements.chatBody[0].scrollHeight
  );
};

// Hide typing indicator
const hideTypingIndicator = () => {
  $(".typing-indicator").remove();
};

// Open chat window
const openChat = () => {
  clientBotState.elements.chatbox.removeClass("boxHide");
  localStorage.setItem("chatbot_visible", "true"); // Save visibility state
};

// Close chat window
const closeChat = (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  clientBotState.elements.chatbox.addClass("boxHide");
  localStorage.setItem("chatbot_visible", "false"); // Save visibility state
};

// Load chat history
const loadChatHistory = () => {
  try {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    clientBotState.elements.chatBody.empty();

    chatHistory.forEach(({ message, messageBy, inputData }) => {
      addMessage(message, messageBy, inputData, false);
    });

    // const typingIndicator = `
    //   <div class="chatbot-typing">
    //     <span class="dot"></span>
    //     <span class="dot"></span>
    //     <span class="dot"></span>
    //   </div>
    // `;
    // clientBotState.elements.chatBody.append(typingIndicator);
  } catch (error) {
    console.error("Failed to load chat history:", error);
  }
};

const refreshChatbot = async () => {
  // Clear session and chat history
  clientBotState.sessionId = null;
  localStorage.removeItem("chatbot_session_id");
  localStorage.removeItem("chatHistory");

  // Reset state properties
  clientBotState.elements.chatBody.empty();
  clientBotState.current = { questionId: null, question: null };
  window.chatbotInstance = null;
  localStorage.setItem("chatbot_visible", "false");
  $(".boticonchat-cover").empty().remove();

  // Reinitialize the chatbot
  try {
    await initChatbot({ token: clientBotState.token });
    // await handleChatboxClick();
  } catch (error) {
    console.error("Error refreshing chatbot:", error);
  }
};

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

const updateRelativeTime = () => {
  $(".chat-time").each(function () {
    const timestamp = $(this).data("timestamp");
    $(this).text(getRelativeTime(timestamp));
  });
};

setInterval(updateRelativeTime, 60000);

// Export initialization function
window.initChatbot = initChatbot;

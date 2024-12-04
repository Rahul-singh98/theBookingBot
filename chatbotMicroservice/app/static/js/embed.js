// Configuration constants
var BACKEND_CHATBOT_API_URL = "http://localhost:8001";
const BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT = "/api/chats";
const BACKEND_CHATBOT_CHATBOT_API_ENDPOINT = "/api/chatbots";

// State management
const clientBotState = {
  token: null,
  sessionId: null,
  backendUrl: null,
  botName: "Chatbot",
  primaryColor: "e06936",
  secondaryColor: "f0f4f8",
  botImage: `${BACKEND_CHATBOT_API_URL}/static/images/bot.svg`,
  elements: {},
  current: {
    questionId: null,
    question: null,
  },
};

function generateRandomId() {
  return Date.now() + '-' + Math.random().toString(36).substring(2, 15);
}

function getOrCreateVisitorId() {
  const localStorageKey = 'visitorId';

  // Check if the visitor ID already exists in localStorage
  let visitorId = localStorage.getItem(localStorageKey);

  if (!visitorId) {
    // Generate a new random ID if it doesn't exist
    visitorId = generateRandomId();

    // Save the new ID to localStorage
    localStorage.setItem(localStorageKey, visitorId);
  }

  return visitorId;
}

// Initialize the chatbot
const initChatbot = async (config) => {
  if (window.chatbotInstance) {
    console.warn("Chatbot instance already exists");
    return window.chatbotInstance;
  }

  if (!config.token) {
    throw new Error("Token is required to initialize the chatbot");
  }

  BACKEND_CHATBOT_API_URL = config.backendUrl;
  clientBotState.backendUrl = config.backendUrl;
  clientBotState.botImage = `${config.backendUrl}/static/images/bot.svg`;
  clientBotState.token = config.token;
  clientBotState.sessionId = localStorage.getItem("chatbot_session_id");

  try {
    await loadDependencies();
    await configureChatbot();
    injectStyles();
    createChatbotHTML();
    initializeElements();
    addEventListeners();
    getOrCreateVisitorId();

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

    const googleScript = document.createElement("script");
    googleScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDsUsav1ZHHeaiHdmK71UFIXAy3yoLA0fk&libraries=places&callback=initAutocomplete`;
    googleScript.defer = true;
    googleScript.onerror = () =>
      reject(new Error("Failed to load Google Places API"));
    document.head.appendChild(googleScript);
  });
};

// Configure chatbot settings
const configureChatbot = async () => {
  try {
    const visitorId = getOrCreateVisitorId()

    // Set up the headers object
    const headers = {
      "Visitor": visitorId,
    };

    const config = await $.ajax({
      url: `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHATBOT_API_ENDPOINT}/${clientBotState.token}`,
      method: "GET",
      headers: headers,
    });

    clientBotState.botName = config.name || clientBotState.botName;
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
              <img src="${BACKEND_CHATBOT_API_URL}/static/images/refresh-23x23.svg" />
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
    const visitorId = getOrCreateVisitorId()

    const response = await $.ajax({
      url: `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${clientBotState.token}`,
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      headers: { "X-Requested-With": "XMLHttpRequest", "Visitor": visitorId },
    });

    if (!response || !response.id) {
      throw new Error("Invalid session response");
    }

    clientBotState.sessionId = response.id;
    localStorage.setItem("chatbot_session_id", clientBotState.sessionId);

    hideTypingIndicator();
    // addMessage(clientBotState.welcomeMessage, "bot");
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
    const visitorId = getOrCreateVisitorId()

    // Set up the headers object
    const headers = {
      "Visitor": visitorId,
    };

    const response = await $.ajax({
      url: `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${clientBotState.sessionId}/next-question`,
      method: "GET",
      headers: headers,
    });

    hideTypingIndicator();

    // Handle different response scenarios
    if (!response) {
      throw new Error("Empty response received");
    }

    // Session completion handling
    if (response.is_completed === true) {
      addMessage("Thank you! The session is complete.", "bot");
      await submitAPIResponse().catch((error) => {
        console.error("Error submitting API response:", error);
        addMessage("There was an issue saving your responses.", "bot", false);
      });
      return;
    }
    // Question type handling
    switch (response.question_type?.toLowerCase()) {
      case "start":
        addMessage(response.question, "bot");
        // Add delay before fetching next question to prevent rapid succession
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await fetchNextQuestion();

      case undefined:
      case null:
        throw new Error("Question type not specified");

      default:
        addMessage(response.question, "bot", response);
    }

    return response;
  } catch (error) {
    hideTypingIndicator();
    addMessage("Error fetching the next question.", "bot");
    console.error("Error fetching question:", error);
  }
};

const submitAPIResponse = async () => {
  if (!clientBotState.sessionId) return;

  try {
    const visitorId = getOrCreateVisitorId()

    const response = await $.ajax({
      url: `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${clientBotState.sessionId}/submit`,
      method: "POST",
      contentType: "application/json", // Ensures JSON format
      dataType: "json",
      headers: { "X-Requested-With": "XMLHttpRequest", "Visitor": visitorId },
    });

    if (response.redirect !== undefined) {
      window.location.href = response.redirect;
    } else {
      throw new Error(response);
    }
  } catch (error) {
    console.error("Answer submission error:", error);
  }
};

// Submit answer
const submitAnswer = async (answer, answerText) => {
  if (!answer || !clientBotState.sessionId) return;

  addMessage(answerText, "user");
  showTypingIndicator();

  try {
    const visitorId = getOrCreateVisitorId();

    const response = await $.ajax({
      url: `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${clientBotState.sessionId}/answer`,
      method: "POST",
      contentType: "application/json", // Ensures JSON format
      dataType: "json",
      data: JSON.stringify({
        answer,
        question_id: clientBotState.current.questionId,
        question: clientBotState.current.question,
        variable: clientBotState.current.variable,
        question_type: clientBotState.current.question_type,
      }), // Stringify the data
      headers: { "X-Requested-With": "XMLHttpRequest", "Visitor": visitorId },
    });

    hideTypingIndicator();

    await fetchNextQuestion();
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
const renderInput = (renderData) => {
  const { question, question_id, question_type, variable, data } = renderData;
  clientBotState.current.question = question;
  clientBotState.current.questionId = question_id;
  clientBotState.current.variable = variable;
  clientBotState.current.question_type = question_type;

  if (question_id) {
    $("#question-id").val(question_id);
  }

  // Show the regular input by default
  $(".chat-footer input").show();

  let inputHtml = "";

  switch (question_type) {
    case "Dropdown":
      inputHtml = createDropdown(data.options);
      break;
    case "ClickList":
      createClickList(data.options, question_id);
      return;
    case "DateTime":
      inputHtml = createInput("datetime-local");
      break;
    case "Date":
      inputHtml = createInput("date");
      break;
    case "Time":
      inputHtml = createInput("time");
      break;
    case "Address":
      inputHtml = createInput("text", "Type your address...");
      break;
    case "Number":
      inputHtml = createInput(
        "number",
        "Enter a number...",
        (min = data.min),
        (max = data.max),
        (defaultValue = data.default),
        (step = data.step)
      );
      break;
    case "Phone":
      inputHtml = createInput("tel", "Enter your phone number...");
      break;
    case "Email":
      inputHtml = createInput("email", "Enter your email...");
      break;
    default:
      inputHtml = createInput("text", "Type your response...");
  }

  clientBotState.elements.userInput.replaceWith(inputHtml);
  clientBotState.elements.userInput = $("#user-input");

  if (question_type === "Address") {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('user-input'));

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        alert("No details available for this location.");
        return;
      }
    });

  }
};

const createInput = (
  type,
  placeholder = "Type your response...",
  defaultValue = null,
  min = null,
  max = null,
  step = null
) => {
  // Swap min and max if min is greater than max
  if (min !== null && max !== null && min > max) {
    // Swap values
    [min, max] = [max, min];
  }

  // Base input element with type and placeholder
  let inputElement = `<input id="user-input" type="${type}" placeholder="${placeholder}" class="form-control"`;

  // If type is 'number', add min, max, and step attributes if they are provided
  if (type === "number") {
    if (min !== null) {
      inputElement += ` min="${min}"`;
    }
    if (max !== null) {
      inputElement += ` max="${max}"`;
    }
    if (step !== null) {
      inputElement += ` step="${step}"`;
    }
  }

  // Add default value if provided
  if (defaultValue !== null) {
    inputElement += ` value="${defaultValue}"`;
  }

  // Close the input element
  inputElement += ">";

  return inputElement;
};

// Create dropdown element
const createDropdown = (options) => {
  const optionsHtml = options
    .map(
      (option) => `<option value="${option.value}">${option.htmlText}</option>`
    )
    .join("");
  return `
    <select id="user-input" class="form-control">
      <option value="">Select</option>
      ${optionsHtml}
    </select>
  `;
};

// Modified createClickList function
const createClickList = (options, questionId) => {
  // Remove any existing clicklist
  $(".chatbot-clicklist").remove();

  // Create wrapper div
  const $wrapper = $("<div>").addClass("chatbot-clicklist");

  // Create button for each option
  options.forEach((option) => {
    $("<button>")
      .addClass("btn btn-outline-primary m-1")
      .text(option.text)
      .on("click", async () => await submitAnswer(option.value, option.text))
      .appendTo($wrapper);
  });

  // Insert after the last message in the chat body
  clientBotState.elements.chatBody.append($wrapper);

  // Scroll to the bottom to show the new options
  clientBotState.elements.chatBody.scrollTop(
    clientBotState.elements.chatBody[0].scrollHeight
  );

  // Hide the regular input while showing clicklist
  $(".chat-footer input").hide();
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
    await initChatbot({
      token: clientBotState.token,
      backendUrl: clientBotState.backendUrl,
    });
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

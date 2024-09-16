const chatbot = document.getElementById("chatbot");
const chatbotBubble = document.getElementById("chatbot-bubble");
const closeBtn = document.getElementById("close-btn");
const chatbotBody = document.getElementById("chatbot-body");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.querySelector(".chatbot-typing");

let sessionId = null;

// Get the chatbot ID from the meta tag
const chatbotId = document
  .querySelector('meta[name="chatbot-id"]')
  .getAttribute("content");

const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

// Function to include CSRF token in fetch requests
function getCSRFHeaders() {
  return {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  };
}

// When chatbot bubble is clicked, start the session
chatbotBubble.addEventListener("click", () => {
  chatbot.classList.remove("d-none");
  chatbotBubble.classList.add("d-none");
  if (sessionId === null) {
    startChatSession();
  }
});

closeBtn.addEventListener("click", () => {
  chatbot.classList.add("d-none");
  chatbotBubble.classList.remove("d-none");
});

// Start the chat session by calling the API
function startChatSession() {
  showTypingIndicator();
  fetch(`/chat/start-session/${chatbotId}/`, {
    method: "POST",
    headers: getCSRFHeaders(),
  })
    .then((response) => response.json())
    .then((data) => {
      sessionId = data.session_id; // store the session ID
      hideTypingIndicator();
      renderQuestion(data);
      //   fetchNextQuestion(); // fetch the first question
    })
    .catch((error) => {
      hideTypingIndicator();
      addMessage("Error starting session. Please try again.", "bot-message");
    });
}

// Fetch the next question
function fetchNextQuestion() {
  showTypingIndicator();
  fetch(`/chat/next-question/${sessionId}/`, {
    method: "POST",
    headers: getCSRFHeaders(),
  })
    .then((response) => response.json())
    .then((data) => {
      hideTypingIndicator();
      renderQuestion(data); // Render question based on type
    })
    .catch((error) => {
      hideTypingIndicator();
      addMessage("Error fetching the next question.", "bot-message");
    });
}

// Render the question based on the type returned from API
function renderQuestion(data) {
  const question = data.question;
  const inputType = data.response_type;
  const options = data.options || [];

  addMessage(question, "bot-message");

  // Create input based on the input_type
  let inputElement;
  switch (inputType) {
    case "dropdown":
      inputElement = replaceInputWithDropdown(options);
      break;
    case "clicklist":
      inputElement = createClickList(options);
      break;
    case "datetime":
      inputElement = replaceInputFieldWith("datetime-local");
      break;
    case "address":
      inputElement = replaceInputFieldWith("address");
      break;
    case "number":
      inputElement = replaceInputFieldWith("number");
      break;
    case "phone":
      inputElement = replaceInputFieldWith("tel");
      break;
    case "email":
      inputElement = replaceInputFieldWith("email");
      break;
    case "input":
    default:
      inputElement = replaceInputFieldWith("text");
      break;
  }

  // chatbotBody.appendChild(inputElement);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

// Create input field for different types
function replaceInputFieldWith(type) {
  // Get the container element
  const inputContainer = document.querySelector(".chatbot-input");
  const children = inputContainer.children

  inputContainer.removeChild(child)

  const userInput = document.getElementById("user-input");
  userInput.type = type;
  userInput.classList.add("form-control");
  userInput.placeholder = `Type your answer...`;

  return userInput;
}

/**
 * Replaces the input field with a dropdown.
 * @param {Array<string>} options - An array of option values for the dropdown.
 */
function replaceInputWithDropdown(options) {
  // Get the container element
  const inputContainer = document.querySelector(".chatbot-input");

  // Create a new select element
  const select = document.createElement("select");
  select.id = "user-input"; // Use the same ID if needed
  select.classList.add("form-control");

  // Create option elements and append them to the select element
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });

  // Create a new button element
  const sendBtn = document.createElement("button");
  sendBtn.id = "send-btn";
  sendBtn.classList.add("btn");
  sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';

  // Remove the old input field
  const oldInput = document.getElementById("user-input");
  if (oldInput) {
    inputContainer.removeChild(oldInput);
  }

  // Append the new select element and button to the container
  inputContainer.appendChild(select);
  inputContainer.appendChild(sendBtn);

  // return inputContainer;
}

// Create click list for 'clicklist' input type
function createClickList(options) {
  const clickListWrapper = document.createElement("div");
  clickListWrapper.classList.add("chatbot-clicklist");

  options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-outline-primary", "m-1");
    button.textContent = option;
    button.addEventListener("click", () => submitAnswer(option));
    clickListWrapper.appendChild(button);
  });

  return clickListWrapper;
}

// Submit the answer and fetch the next question
function submitAnswer(answer) {
  if (answer) {
    addMessage(answer, "user-message");
    showTypingIndicator();

    fetch(`/chat/submit/${sessionId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": "{{ csrf_token }}", // Django CSRF token
      },
      body: JSON.stringify({ answer }),
    })
      .then((response) => response.json())
      .then((data) => {
        hideTypingIndicator();
        if (data.is_complete) {
          addMessage("Thank you! The session is complete.", "bot-message");
        } else {
          fetchNextQuestion(); // Fetch the next question
        }
      })
      .catch((error) => {
        hideTypingIndicator();
        addMessage("Error submitting answer.", "bot-message");
      });
  }
}

// Helper functions for messages
function addMessage(message, className) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chatbot-message", className);
  messageElement.textContent = message;
  chatbotBody.insertBefore(messageElement, typingIndicator);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function showTypingIndicator() {
  typingIndicator.style.display = "block";
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function hideTypingIndicator() {
  typingIndicator.style.display = "none";
}

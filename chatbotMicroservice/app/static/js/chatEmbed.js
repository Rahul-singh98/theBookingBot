// Configuration constants
const BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT = "/api/chats";

async function getChatHistory(config) {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("sID");

  // Check if sessionId is null or undefined
  if (!sessionId) {
    console.warn("No session ID found in URL parameters");
    return;
  }

  const BACKEND_CHATBOT_API_URL = config.backendUrl || "http://localhost:8001";

  try {
    // Replace with your actual API endpoint
    const response = await fetch(
      `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if data and data.response exist
    if (!data || !data.response) {
      console.error("Invalid response format");
      return;
    }

    // Update form elements
    data.response.forEach((item) => {
      const element = document.getElementById(item.variable);
      if (element) {
        element.value = item.answer;
      } else {
        console.warn(`Element with ID '${item.variable}' not found`);
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

window.getChatHistory = getChatHistory;

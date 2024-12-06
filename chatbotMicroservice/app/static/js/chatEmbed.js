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
    const response = await fetch(
      `${BACKEND_CHATBOT_API_URL}${BACKEND_CHATBOT_CHAT_SESSION_API_ENDPOINT}/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.response) {
      console.error("Invalid response format");
      return;
    }

    for (const item of data.response) {
      const element = document.getElementById(item.variable);

      if (item.question_type === "Button" && element) {
        // Simulate button click and wait for 2 seconds
        element.click();
        await new Promise((resolve) => setTimeout(resolve, item.data.wait_after || 2));
      } else if (element) {
        element.value = item.answer;
      } else {
        console.warn(`Element with ID '${item.variable}' not found`);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

window.getChatHistory = getChatHistory;

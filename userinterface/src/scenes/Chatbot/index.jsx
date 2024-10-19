import React, { useEffect, useState } from "react";
import { get_chatbots } from "@/api/chatbot";
import { CHATBOT_API_URL, ChatRoutes } from "@/api/routes";

const ChatbotComponent = () => {
  const [chatbotResponse, setChatbotResponse] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Fetch chatbot data from the API
    const fetchChatbotData = async () => {
      try {
        const response = await get_chatbots();
        console.log(response); // Debugging the response
        if (response?.data?.items && response.data.items.length > 0) {
          setChatbotResponse(response.data.items);
        } else {
          setChatbotResponse("No chatbot data available.");
        }
      } catch (error) {
        console.error("Error fetching chatbot data:", error);
        setChatbotResponse("Failed to load chatbot data.");
      }
    };

    fetchChatbotData();
    loadChatbotResources();
  }, []);

  // Function to load external resources (CSS and JS)
  const loadChatbotResources = () => {
    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${CHATBOT_API_URL}${ChatRoutes.CHATBOT_STATIC_CSS_PATH}`;
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = `${CHATBOT_API_URL}${ChatRoutes.CHATBOT_STATIC_JS_PATH}`;
    script.async = true;

    script.onload = () => {
      console.log("Chatbot script loaded successfully");
      setScriptLoaded(true);
    };

    document.head.appendChild(script);
  };

  useEffect(() => {
    if (scriptLoaded) {
      // This will only run after the script is loaded
      const initializeChatbot = () => {
        const chatbotConfig = {
          token: "95996ae5-408c-4ce2-8f0d-9e3bff6dd80c",
        };

        if (window.Chatbot) {
          console.log("Initializing chatbot...");
          new window.Chatbot(chatbotConfig);
        } else {
          console.error("Chatbot library not available yet");
        }
      };

      // Check if document is already loaded
      if (document.readyState === "complete") {
        initializeChatbot();
      } else {
        // Wait for DOM content to be loaded
        document.addEventListener("DOMContentLoaded", initializeChatbot);

        // Cleanup listener
        return () => {
          document.removeEventListener("DOMContentLoaded", initializeChatbot);
        };
      }
    }
  }, [scriptLoaded]);

  return (
    <div className="col-xl-5">
      <div id="ssiframecontainerbot"></div>
    </div>
  );
};

export default ChatbotComponent;

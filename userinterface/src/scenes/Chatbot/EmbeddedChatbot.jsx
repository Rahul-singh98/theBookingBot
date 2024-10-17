import React, { useEffect, useRef } from "react";
import { CHATBOT_API_URL, ChatRoutes } from "@/api/routes";

const EmbeddedChatbot = ({
  token = "95996ae5-408c-4ce2-8f0d-9e3bff6dd80c",
}) => {
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load external CSS files
    const loadCSS = (href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    // Add CSRF meta tag if not present
    const addCSRFMeta = () => {
      if (!document.querySelector('meta[name="csrf-token"]')) {
        const meta = document.createElement("meta");
        meta.name = "csrf-token";
        // You'll need to pass the actual CSRF token here
        meta.content = ""; // Add your CSRF token here
        document.head.appendChild(meta);
      }
    };

    // Load CSS files
    loadCSS(`${CHATBOT_API_URL}${ChatRoutes.CHATBOT_STATIC_CSS_PATH}`);
    loadCSS("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css")
    addCSRFMeta();

    // Load and initialize embed.js
    const loadScript = () => {
      return new Promise((resolve, reject) => {
        if (scriptLoadedRef.current) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = `${CHATBOT_API_URL}${ChatRoutes.CHATBOT_STATIC_JS_PATH}`;

        script.onload = () => {
          // Define the class on window object
          window.Chatbot = Chatbot;
          scriptLoadedRef.current = true;
          resolve();
        };

        script.onerror = (error) => {
          reject(new Error(`Script load error: ${error}`));
        };

        document.body.appendChild(script);
      });
    };

    const initializeChatbot = async () => {
      try {
        await loadScript();

        // Initialize with configuration
        const chatbotConfig = {
          token: token,
        //   botName: "AI Assistant", // Customize as needed
        //   welcomeMessage: "Hello! How can I help you today?", // Customize as needed
        };

        // Create new instance
        new window.Chatbot(chatbotConfig);
      } catch (error) {
        console.error("Failed to initialize chatbot:", error);
      }
    };

    initializeChatbot();

    // Cleanup function
    return () => {
      if (scriptLoadedRef.current) {
        // Remove the chatbot elements from DOM
        const chatbotBubble = document.getElementById("chatbot-bubble");
        const chatbotContainer = document.getElementById("chatbot");
        if (chatbotBubble) chatbotBubble.remove();
        if (chatbotContainer) chatbotContainer.remove();

        // Remove the script
        const embedScript = document.querySelector(
          `script[src="${CHATBOT_API_URL}${ChatRoutes.CHATBOT_STATIC_JS_PATH}"]`
        );
        if (embedScript) embedScript.remove();

        // Remove the styles
        const styles = document.querySelectorAll(
          `link[href*="${ChatRoutes.CHATBOT_STATIC_CSS_PATH}"]`
        );
        styles.forEach((style) => style.remove());

        scriptLoadedRef.current = false;
      }
    };
  }, [token]); // Re-run effect if token changes

  return <div id="ssiframecontainerbot"></div>;
};

export default EmbeddedChatbot;

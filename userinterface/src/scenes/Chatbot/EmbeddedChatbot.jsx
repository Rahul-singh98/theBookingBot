import React, { useEffect } from "react";
import { CHATBOT_API_URL, BACKEND_URL } from "@/api/routes";


const EmbeddedChatbot = ({ token }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${CHATBOT_API_URL === undefined ? "" : CHATBOT_API_URL}/static/js/embed.min.js`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.initChatbot) {

        // Initialize chatbot with token, backendUrl, and visitorId
        window.initChatbot({
          token,
          backendUrl: BACKEND_URL
        });
      } else {
        console.error("initChatbot is not available");
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [token]);

  return null; // This component doesn't render anything visible
};

export default EmbeddedChatbot;

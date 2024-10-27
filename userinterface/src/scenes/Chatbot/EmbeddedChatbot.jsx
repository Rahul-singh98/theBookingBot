import React, { useEffect, useRef } from "react";
import { CHATBOT_API_URL, ChatRoutes } from "@/api/routes";

const EmbeddedChatbot = ({ token }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${CHATBOT_API_URL}/static/js/embed.min.js`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.initChatbot) {
        window.initChatbot({ token, backendUrl: CHATBOT_API_URL });
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

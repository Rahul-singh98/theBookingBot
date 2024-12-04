import React, { useEffect, useRef } from "react";
import { ChatRoutes } from "@/api/routes";

const EmbeddedChatbot = ({ token }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `/static/js/embed.min.js`;
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.initChatbot) {
        window.initChatbot({ token, backendUrl: "" });
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

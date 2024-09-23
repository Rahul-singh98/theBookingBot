import React, { useEffect, useState } from "react";

const ChatbotComponent = () => {
  const [chatbotResponse, setChatbotResponse] = useState(null);
  const chatbotService = import.meta.env.VITE_CHATBOT_SERVICE;

  useEffect(() => {
    // Example API call to the chatbot service using the dynamic port
    const fetchChatbotData = async () => {
      try {
        const response = await fetch(`${chatbotService}/api/chatbots/`);
        const data = await response.json();
        console.log(data)
        if (data.items && data.items.length > 0) {
          // Assuming that you want to display something from the items array
          setChatbotResponse(data.items);
        } else {
          setChatbotResponse("No chatbot data available.");
        }
      } catch (error) {
        console.error("Error fetching chatbot data:", error);
      }
    };

    fetchChatbotData();
  }, [chatbotService]);

  return (
    <div>
      <h1>Chatbot Service</h1>
      <p>Chatbot is running on port: {chatbotService}</p>
      {chatbotResponse ? (
        <p>Chatbot says: {chatbotResponse}</p>
      ) : (
        <p>Loading chatbot response...</p>
      )}
    </div>
  );
};

export default ChatbotComponent;

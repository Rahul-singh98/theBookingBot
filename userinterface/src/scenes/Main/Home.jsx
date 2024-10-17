import React from "react";
import ChatbotComponent from "@/scenes/Chatbot";
import EmbeddedChatbot from "@/scenes/Chatbot/EmbeddedChatbot";

const Home = () => {
  return (
    <>
      <div>Hello From React</div>
      {/* <ChatbotComponent /> */}
      <EmbeddedChatbot />
    </>
  );
};

export default Home;

import React from "react";
import ChatbotComponent from "@/scenes/Chatbot";
import EmbeddedChatbot from "@/scenes/Chatbot/EmbeddedChatbot";

const Home = () => {
  return (
    <>
      <div>Hello From React</div>
      {/* <ChatbotComponent /> */}
      <EmbeddedChatbot token="0a617aaa-4fe4-4378-a1f5-f0acfd2f7e4e" />
    </>
  );
};

export default Home;

// import React from "react";
// import ChatbotComponent from "@/scenes/Chatbot";
// import EmbeddedChatbot from "@/scenes/Chatbot/EmbeddedChatbot";
// import Navbar from "../Main/Navbar";
// import Footer from "../Main/Footer";
// import Intro from "../Main/Intro";
// import Form from "../Main/Form";
// import CustomerStories from "../Main/Customerstories";
// import PartnerSection from "./Partnersection";
// import MarqueeSection from "../Main/Marquee";
// import CounterSection from "./Countersection";
// // import ServiceTabs from "../Main/Service";
// import ServiceTabs from "../Main/Service"
// const Home = () => {
//   return (
//     <>
      
//       {/* <ChatbotComponent /> */}
//       <EmbeddedChatbot token="0a617aaa-4fe4-4378-a1f5-f0acfd2f7e4e" />
//       <Navbar />
//       <Intro/>
//       <ServiceTabs />
//       <MarqueeSection/>
//       <PartnerSection/>
//       <CounterSection/>
//       <Form/>
//       <CustomerStories/>
//       <Footer/>

//     </>
//   );
// };

// export default Home;


import React from "react";
import EmbeddedChatbot from "@/scenes/Chatbot/EmbeddedChatbot";
import Navbar from "../Main/Navbar";
import Footer from "../Main/Footer";
import Intro from "../Main/Intro";
import Form from "../Main/Form";
import CustomerStories from "../Main/Customerstories";
import PartnerSection from "./Partnersection";
import MarqueeSection from "../Main/Marquee";
import CounterSection from "./Countersection";
import ServiceTabs from "../Main/Service";  // Default import

const Home = () => {
  return (
    <>
      <EmbeddedChatbot token="0a617aaa-4fe4-4378-a1f5-f0acfd2f7e4e" />
      <Navbar />
      <Intro />
      <ServiceTabs />
      <MarqueeSection />
      <PartnerSection />
      <CounterSection />
      <Form />
      <CustomerStories />
      <Footer />
    </>
  );
};

export default Home;

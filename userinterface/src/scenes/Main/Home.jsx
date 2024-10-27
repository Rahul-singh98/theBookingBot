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
import ServiceTabs from "../Main/Service";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const routeToken = searchParams.get("token");
  const token = routeToken || "e55758c5-b2cf-49ad-a440-02b99769f7c1";

  return (
    <>
      {/* <EmbeddedChatbot token="0a617aaa-4fe4-4378-a1f5-f0acfd2f7e4e" /> */}
      <EmbeddedChatbot token={token} />
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

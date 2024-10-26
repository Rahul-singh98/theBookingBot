import React from "react";
import Navbar from "../Main/Navbar";
import Footer from "../Main/Footer";
import Intro from "../Main/Intro";
import Form from "../Main/Form";
import CustomerStories from "../Main/Customerstories";

import ServiceTabs from "../Main/Service";
// import ClientMarquee from './components/ClientMarquee';
// import CounterSection from './components/CounterSection';
// import PartnerCarousel from './components/PartnerCarousel';
// import CustomerStories from "./CustomerStories"; // Ensure this file exists
import MarqueeSection from "../Main/Marquee";
import CounterSection from "../Main/Countersection";
// import PartnerSection from "./Partnersection";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Intro/>
      {/* <Footer/> */}
        <ServiceTabs />
        <MarqueeSection/>
        {/* <PartnerSection/> */}
        <CounterSection/>
        <Form/>
        <CustomerStories/>
        <Footer/>

        {/* <ClientMarquee />
        <CounterSection />
        <PartnerCarousel /> */}
    </div>
  );
};

export default Home;

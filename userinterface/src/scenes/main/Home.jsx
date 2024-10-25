import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Intro from "./Intro";
import Form from "./Form";
import CustomerStories from "./Customerstories";

import ServiceTabs from "./Service";
// import ClientMarquee from './components/ClientMarquee';
// import CounterSection from './components/CounterSection';
// import PartnerCarousel from './components/PartnerCarousel';
// import CustomerStories from "./CustomerStories"; // Ensure this file exists
import MarqueeSection from "./Marquee";
import CounterSection from "./Countersection";
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

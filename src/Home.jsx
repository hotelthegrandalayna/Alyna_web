import React from "react";
import Hero from "./components/Hero";
import PopularAccommodations from "./components/PopularAccommodations";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import MapSection from "./components/MapSection";
import ScrollReveal from "./components/ScrollReveal";

const Home = () => {
  return (
    <>
      <ScrollReveal />

      <Hero />

      <div className="scroll-animate">
        <PopularAccommodations />
      </div>

      <div className="scroll-animate">
        <Features />
      </div>

      <div className="scroll-animate">
        <Testimonials />
      </div>

      <MapSection />
    </>
  );
};

export default Home;

import React from "react";
import Hero from "./components/Hero";
import PopularAccommodations from "./components/PopularAccommodations";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import MapSection from "./components/MapSection";

const Home = () => {
  return (
    <>
      <Hero />
      <PopularAccommodations />
      <Features />
      <Testimonials />
      <MapSection />
    </>
  );
};

export default Home;

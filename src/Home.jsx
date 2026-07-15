import React, { useEffect, useState } from "react";
import SEO from "./components/SEO";
import Hero from "./components/Hero";
import PopularAccommodations from "./components/PopularAccommodations";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import MapSection from "./components/MapSection";
import ScrollReveal from "./components/ScrollReveal";
import { supabase } from "./lib/supabaseClient";

const Home = () => {
  const [reloadKey, setReloadKey] = useState(() => String(Date.now()));

  useEffect(() => {
    let mounted = true;

    async function loadPageVersion() {
      try {
        const { data, error } = await supabase.from("pages").select("id, updated_at").eq("slug", "home").maybeSingle();
        if (error) {
          console.error("Error fetching home page version:", error.message || error);
          return;
        }
        if (!mounted || !data) return;
        // use updated_at as a simple version key so children remount on changes
        const key = data.updated_at ? String(new Date(data.updated_at).getTime()) : String(Date.now());
        setReloadKey(key);
      } catch (e) {
        console.error(e);
      }
    }

    loadPageVersion();

    // poll occasionally to pick up edits made in admin panel without full page refresh
    const interval = setInterval(loadPageVersion, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <SEO
        description="Hotel The Grand Alayna is a boutique hotel in Sitakund, Chittagong offering spotless rooms, warm hospitality and 24/7 reception. Minutes from Chandranath Temple, Guliakhali Beach and Eco Park. Book on WhatsApp +880 1883-352526."
        path="/"
      />
      <ScrollReveal />

      <Hero key={`hero-${reloadKey}`} />

      <div className="scroll-animate">
        <PopularAccommodations key={`popular-${reloadKey}`} />
      </div>

      <div className="scroll-animate">
        <Features key={`features-${reloadKey}`} />
      </div>

      <div className="scroll-animate">
        <Testimonials key={`testimonials-${reloadKey}`} />
      </div>

      <MapSection key={`map-${reloadKey}`} />
    </>
  );
};

export default Home;

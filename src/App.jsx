import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Home";
import AboutPage from "./components/AboutPage";
import "./App.css";
import "./styles/scroll-animate.css";
import ScrollReveal from "./components/ScrollReveal";
import ScrollToTop from "./components/ScrollToTop";
import MapContactSection from "./components/MapContactSection";
import Gallery from "./components/Gallery";
import RoomDetails from "./components/RoomDetails";
import Admin from "./components/Admin";
import { CalendarProvider } from "./context/CalendarContext";
import { Analytics } from "@vercel/analytics/react";

import { supabase } from "./lib/supabaseClient";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const testSupabase = async () => {
      const { data, error } = await supabase.auth.getSession();

      console.log("Supabase session:", data);
      console.log("Supabase error:", error);
    };

    testSupabase();
  }, []);

  return (
    <HelmetProvider>
    <Router>
      <CalendarProvider>
        <div className="app">
          <ScrollToTop />
          <ScrollReveal />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<MapContactSection />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/rooms/:slug" element={<RoomDetails />} />
              {/* legacy single-room paths redirect to rooms listing */}
              <Route path="/room" element={<Navigate to="/" replace />} />
              <Route path="/room2" element={<Navigate to="/" replace />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <Analytics />
        </div>
      </CalendarProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Home";
import AboutPage from "./components/AboutPage";
import "./App.css";
import "./styles/scroll-animate.css";
import ScrollReveal from "./components/ScrollReveal";
import MapContactSection from "./components/MapContactSection";
import Gallery from "./components/Gallery";
import RoomDetails from "./components/RoomDetails";
import RoomDetails2 from "./components/RoomDetails2";
import Admin from "./components/Admin";
import { CalendarProvider } from "./context/CalendarContext";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <CalendarProvider>
        <div className="app">
          <ScrollReveal />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<MapContactSection />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/room" element={<RoomDetails />} />
              <Route path="/room2" element={<RoomDetails2 />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <Analytics />
        </div>
      </CalendarProvider>
    </Router>
  );
}

export default App;

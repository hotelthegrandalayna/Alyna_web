import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Home";
import AboutPage from "./components/AboutPage";
import "./App.css";
import MapContactSection from "./components/MapContactSection";
import Gallery from "./components/Gallery";
import RoomDetails from "./components/RoomDetails";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<MapContactSection />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/room" element={<RoomDetails />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

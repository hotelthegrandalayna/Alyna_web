import Header from './components/Header';
import Hero from './components/Hero';
import PopularAccommodations from './components/PopularAccommodations';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <PopularAccommodations />
        <Features />
        <Testimonials />
        <MapSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;
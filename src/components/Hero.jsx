import "./Hero.css";

export default function Hero() {
  return (
    <div className="hero-wrapper">
      <section className="hero" id="home">
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
            alt="Lush green hills with mist"
          />
        </div>
        <div className="hero-content scroll-animate">
          <h1>
            <span>Wake Up</span> <br />
            <span>Where the Hills</span> <br />
            <span>Meet the Sea</span>
          </h1>
          <p>
            <span className="hero-accent"></span>
            <span>Comfort for Every Traveler,</span>
            <br />
            <span>From Budget to Luxury at the</span>
            <br />
            <span>heart of the Sitakund.</span>
          </p>
        </div>
      </section>
    </div>
  );
}

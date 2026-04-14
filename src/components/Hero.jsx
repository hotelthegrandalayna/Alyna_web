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
        <div className="hero-content">
          <h1>
            Wake Up <br />
            Where the Hills <br />
            Meet the Sea
          </h1>
          <p>
            <span className="hero-accent"></span>
            Comfort for Every Traveler,
            <br />
            From Budget to Luxury at the
            <br />
            heart of the Sitakund.
          </p>
        </div>
      </section>
    </div>
  );
}

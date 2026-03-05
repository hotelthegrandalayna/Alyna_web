import "./Features.css";

const features = [
  { icon: "📶", label: "Free Wi-fi" },
  { icon: "📱", label: "Digital check-in" },
  { icon: "🅿️", label: "Free Parking" },
  { icon: "🏊", label: "Swimming" },
  { icon: "🎬", label: "Outdoor movie" },
];

const amenityItems = [
  { icon: "📶", label: "Free Internet Access" },
  { icon: "📱", label: "Digital Check-in" },
  { icon: "🅿️", label: "Free Parking" },
  { icon: "🚶", label: "Outdoor Activity" },
  { icon: "🍽️", label: "Restaurant On-Site" },
];

export default function Features() {
  return (
    <section className="features" id="about">
      <div className="features-grid">
        <div className="features-content">
          <span className="section-label">EASY LIFE</span>
          <h2>what special we offer to our guests</h2>
          <p>
            At Alyna&apos;s Resort, we believe in creating memorable
            experiences. From our luxurious accommodations to our world-class
            amenities, every detail is designed with your comfort in mind. Enjoy
            breathtaking views, exceptional dining, and activities for the whole
            family.
          </p>
          <div className="feature-images">
            <img
              src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150&q=80"
              alt="Outdoor"
            />
            <img
              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=150&q=80"
              alt="Pathway"
            />
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&q=80"
              alt="Light"
            />
          </div>
          <div className="feature-icons">
            {features.map((f) => (
              <div key={f.label} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="features-image">
          <img
            src="https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80"
            alt="BBQ and dining"
          />
        </div>
      </div>
      <div className="amenities-section">
        <span className="section-label">AMENITIES</span>
        <h2>Explore Our Amenities for All</h2>
        <div className="amenity-list">
          {amenityItems.map((item) => (
            <div key={item.label} className="amenity-item">
              <span className="amenity-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

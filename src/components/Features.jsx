import "./Features.css";

const features = [
  { icon: "📶", label: "Free Internet Access" },
  { icon: "📱", label: "Digital Check-In" },
  { icon: "🅿️", label: "Free Parking" },
  { icon: "🏊", label: "Swimming" },
  { icon: "🎬", label: "Outdoor movie" },
  { icon: "📶", label: "Free Internet Access" },
  { icon: "📱", label: "Digital Check-in" },
  { icon: "🅿️", label: "Free Parking" },
];

const amenityItems = [
  { icon: "📶", label: "Free Internet Access" },
  { icon: "📱", label: "Digital Check-in" },
  { icon: "🅿️", label: "Free Parking" },
  { icon: "🚶", label: "Outdoor Activity" },
  { icon: "🍽️", label: "Restaurant On-Site" },
  { icon: "📶", label: "Free Internet Access" },
  { icon: "📱", label: "Digital Check-in" },
  { icon: "🅿️", label: "Free Parking" },
];

export default function Features() {
  return (
    <section className="features" id="about">
      <div className="features-grid">
        <div className="features-content">
          <span className="section-label-f">FACILITIES</span>
          <h2>
            what special
            <br /> we offer to our guests
          </h2>
          <p>
            Attractively ornamented with complete marble & tiles and luxurious
            fabrics, our two prominent Presidential suites are 1900 1800 sq ft.
            These two unique suites boast an octagonal living area, the sides of
            which are fitted with windows overlooking the sea, the Bay of Bengal
            for the best views in the city.
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
        </div>
        <div className="features-image">
          <img
            src="https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80"
            alt="BBQ and dining"
          />
        </div>
      </div>
      <div className="feature-icons">
        {features.map((f) => (
          <div key={f.label} className="feature-item">
            <span className="feature-icon">{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
      <div className="amenities-section">
        <span className="section-label-f">FACILITIES</span>
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

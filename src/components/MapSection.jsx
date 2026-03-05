import './MapSection.css';

export default function MapSection() {
  const mapLink = 'https://maps.app.goo.gl/fzs7K4xhSoEAsMto9';
  const embedUrl = 'https://www.google.com/maps?q=22.625363,91.6411512&output=embed';

  return (
    <section className="map-section">
      <div className="map-container">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Alyna&apos;s Resort Location"
        />
        <div className="map-overlay">
          <div className="map-pin">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="map-btn"
          >
            View large map
          </a>
        </div>
      </div>
      <div className="map-mobile-overlay">
        <div className="map-pin-mobile">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="map-btn-mobile"
        >
          FIND US ON MAP
        </a>
      </div>
    </section>
  );
}
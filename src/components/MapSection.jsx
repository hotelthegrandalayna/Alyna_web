import "./MapSection.css";

export default function MapSection() {
  const mapLink =
    "https://www.google.com/maps/place/Hotel+The+Grand+Alayna/@22.625429,91.6410396,202m/data=!3m2!1e3!4b1!4m6!3m5!1s0x375333a364aee56f:0x583f7e86bd721c51!8m2!3d22.625429!4d91.6416833!16s%2Fg%2F11npd8b8d9?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D";

  const embedUrl =
    "https://www.google.com/maps?q=22.625429,91.6416833&output=embed";

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
          title="Alyna's Resort Location"
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
            style={{ backgroundColor: "#6547DB" }}
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

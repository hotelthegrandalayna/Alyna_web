import "./MapContactSection.css";
import HomeContactHeader from "./HomeContactHeader";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const MapContactSection = () => {
  // Placeholder image - REPLACE WITH YOUR MAP IMAGE ASSET PATH
  const mapImageUrl =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

  return (
    <div>
      <HomeContactHeader />
      <div className="section-container">
        {/* Left Column (Contact Details) */}
        <div className="details-col">
          <h2 className="resort-title">Alyna's Resort</h2>

          <div className="contact-info-list">
            {/* Location */}
            <div className="info-item">
              <div className="icon-box location-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="text-box">
                <h4>Location</h4>
                <p>
                  Ward No. 9, Shibpur, Palli Bidyut Road, Sitakund,
                  Chattogram-4310, Bangladesh.
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="info-item">
              <div className="icon-box phone-icon">
                <FaPhoneAlt />
              </div>
              <div className="text-box">
                <h4>Phone</h4>
                <p>+8801878150350</p>
                <p>+8801878150350</p>
              </div>
            </div>

            {/* Email */}
            <div className="info-item">
              <div className="icon-box email-icon">
                <FaEnvelope />
              </div>
              <div className="text-box">
                <h4>Email Support</h4>
                <p>alynasresort@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Social Links (Follow us) */}
          <div className="social-follow-row">
            <span className="follow-text">Follow us</span>
            <div className="social-icons">
              <a href="#" className="social-link facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-link twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link youtube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (Map Image Box) */}
        <div className="map-image-col">
          <div className="framed-map-box">
            <img src={mapImageUrl} alt="Location Map with Pins" />
            <div className="map-overlay-card">
              <h3>Ayna's Resort</h3>
              <a
                href="https://maps.app.goo.gl/fYQViFEFsVq5GEmb9"
                target="_blank"
                className="map-link"
              >
                view large map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContactSection;

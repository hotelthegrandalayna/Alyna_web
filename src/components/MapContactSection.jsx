import "./MapContactSection.css";
import HomeContactHeader from "./HomeContactHeader";
import ScrollReveal from "./ScrollReveal";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const MapContactSection = () => {
  // Placeholder image - REPLACE WITH YOUR MAP IMAGE ASSET PATH
  const mapImageUrl =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

  return (
    <div>
      <HomeContactHeader title="Contact" />
      <ScrollReveal />
      <div className="section-container scroll-animate">
        {/* Left Column (Contact Details) */}
        <div className="details-col scroll-animate">
          <h2 className="resort-title">Alyna's Resort</h2>

          <div className="contact-info-list">
            {/* Location */}
            <div className="info-item">
              <div className="icon-box location-icon">
                <FaLocationDot />
              </div>
              <div className="text-box">
                <h4>Location</h4>
                <p className="italicS">
                  Ward No. 9, Shibpur, Palli Bidyut Road, Sitakund,
                  Chattogram-4310, Bangladesh.
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="info-item">
              <div className="icon-box">
                <FaPhoneAlt />
              </div>
              <div className="text-box">
                <h4>Phone</h4>
                <p className="italicS">+8801878150350</p>
                <p className="italicS">+8801878150350</p>
              </div>
            </div>

            {/* Email */}
            <div className="info-item">
              <div className="icon-box email-icon">
                <FaEnvelope />
              </div>
              <div className="text-box">
                <h4>Email Support</h4>
                <p className="italicS">alynasresort@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Social Links (Follow us) */}
          <div className="social-section">
            <div className="social-label">
              <span className="social-line" />
              <span className="follow-text">Follow us</span>
            </div>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="facebook">
                <FaFacebook />
              </a>
              <a href="#" aria-label="WhatsApp" className="whatsapp">
                <FaWhatsapp />
              </a>
              <a href="#" aria-label="Instagram" className="instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="YouTube" className="youtube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (Map Image Box) */}
        <div className="map-image-col scroll-animate">
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

import "./MapContactSection.css";
import HomeContactHeader from "./HomeContactHeader";
import ScrollReveal from "./ScrollReveal";
import OptimizedImage from "./OptimizedImage";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
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
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  // Placeholder image - REPLACE WITH YOUR MAP IMAGE ASSET PATH
  const mapImageUrl =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80";

  useEffect(() => {
    let mounted = true;
    async function loadContact() {
      try {
        const { data, error } = await supabase.from("contact_info").select("*").limit(1).maybeSingle();
        if (error) {
          console.error("Error loading contact_info:", error.message || error);
          return;
        }
        if (!mounted) return;
        setInfo(data || null);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
    loadContact();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <HomeContactHeader title="Contact" loading={loading} image={mapImageUrl} />
      <ScrollReveal />
      <div className="section-container scroll-animate">
        {/* Left Column (Contact Details) */}
        <div className="details-col scroll-animate">
          <h2 className="resort-title">{!loading ? (info?.resort_name || "Alyna's Resort") : ""}</h2>

          <div className="contact-info-list">
            {/* Location */}
            <div className="info-item">
              <div className="icon-box location-icon">
                <FaLocationDot />
              </div>
              <div className="text-box">
                <h4>Location</h4>
                <p className="italicS">{!loading ? (info?.address || "Ward No. 9, Shibpur, Palli Bidyut Road, Sitakund, Chattogram-4310, Bangladesh.") : ""}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="info-item">
              <div className="icon-box">
                <FaPhoneAlt />
              </div>
              <div className="text-box">
                <h4>Phone</h4>
                {!loading && (Array.isArray(info?.phones) ? (
                  info.phones.map((p, idx) => (
                    <p key={idx} className="italicS">{p}</p>
                  ))
                ) : (
                  <p className="italicS">{info?.phones || "+8801878150350"}</p>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="info-item">
              <div className="icon-box email-icon">
                <FaEnvelope />
              </div>
              <div className="text-box">
                <h4>Email Support</h4>
                <p className="italicS">{!loading ? (info?.email || "info@hotelthegrandalayna.com") : ""}</p>
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
              <a href={info?.social?.facebook || "#"} aria-label="Facebook" className="facebook">
                <FaFacebook />
              </a>
              <a href={info?.social?.whatsapp || "#"} aria-label="WhatsApp" className="whatsapp">
                <FaWhatsapp />
              </a>
              <a href={info?.social?.instagram || "#"} aria-label="Instagram" className="instagram">
                <FaInstagram />
              </a>
              <a href={info?.social?.youtube || "#"} aria-label="YouTube" className="youtube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (Map Image Box) */}
        <div className="map-image-col scroll-animate">
          <div className="framed-map-box">
            <OptimizedImage src={mapImageUrl} alt="Location Map with Pins" />
            <div className="map-overlay-card">
              <h3>{!loading ? (info?.resort_name || "Ayna's Resort") : ""}</h3>
              {!loading && (
                <a
                  href={info?.map_url || "https://maps.app.goo.gl/fYQViFEFsVq5GEmb9"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="map-link"
                >
                  view large map
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapContactSection;

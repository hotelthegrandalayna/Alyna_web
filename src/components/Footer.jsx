import "./Footer.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-logo">
          Alyna&apos;s <br /> Resort
        </div>
        <div className="footer-info">
          <div className="contact-row">
            <div className="contact-icon">
              <FaLocationDot />
            </div>
            <div className="contact-label">Location</div>
            <div className="contact-value">
              Ward No. 9, Shibpur, Palli Bidyut Road, Sitakund, Chattogram-4310,
              Bangladesh.
            </div>
          </div>
          <div className="contact-row">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>
            <div className="contact-label">Phone</div>
            <div className="contact-value">
              +8801878150350 &nbsp;&nbsp; +8801878150350
            </div>
          </div>
          <div className="contact-row">
            <div className="contact-icon">
              <MdEmail />
            </div>
            <div className="contact-label">Email Support</div>
            <div className="contact-value">alynasresort@gmail.com</div>
          </div>

          <div className="social-section-2">
            <div className="social-label-2">
              <span className="social-line-2" />
              <span className="follow-text-2">Follow us</span>
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
      </div>
    </footer>
  );
}

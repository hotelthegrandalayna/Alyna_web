import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-logo">Alyna&apos;s Resort</div>
        <div className="footer-info">
          <div className="contact-row">
            <div className="contact-icon">📍</div>
            <div className="contact-label">Location</div>
            <div className="contact-value">
              Ward No. 9, Shitpur, Palli Bidyut Road, Sitakund, Chattogram-4310, Bangladesh.
            </div>
          </div>
          <div className="contact-row">
            <div className="contact-icon">📞</div>
            <div className="contact-label">Phone</div>
            <div className="contact-value">
              +8801878150350 &nbsp;&nbsp; +8801878150350
            </div>
          </div>
          <div className="contact-row">
            <div className="contact-icon">✉️</div>
            <div className="contact-label">Email Support</div>
            <div className="contact-value">alynasresort@gmail.com</div>
          </div>

          <div className="social-section">
            <div className="social-label">
              <span className="social-line" />
              <span className="follow-text">Follow us</span>
            </div>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="facebook">f</a>
              <a href="#" aria-label="WhatsApp" className="whatsapp">w</a>
              <a href="#" aria-label="Instagram" className="instagram">i</a>
              <a href="#" aria-label="YouTube" className="youtube">▶</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
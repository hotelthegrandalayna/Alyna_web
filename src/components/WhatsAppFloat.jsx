import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { BOOKING_WHATSAPP_URL } from "./Header";
import "./WhatsAppFloat.css";

export default function WhatsAppFloat() {
  const location = useLocation();

  // keep the admin dashboard clean
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <a
      className="whatsapp-float"
      href={BOOKING_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book on WhatsApp"
    >
      <FaWhatsapp />
      <span className="whatsapp-float-label">Book on WhatsApp</span>
    </a>
  );
}

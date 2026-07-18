import React, { useEffect, useState } from "react";
import "./Footer.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient";

export default function Footer() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data, error } = await supabase
          .from("contact_info")
          .select("*")
          .maybeSingle();
        if (error) throw error;
        if (!mounted) return;
        setContact(data || {});
      } catch (e) {
        console.error("Error loading contact info:", e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const address =
    contact?.address ||
    "Ward No. 9, Shibpur, Palli Bidyut Road, Sitakund, Chittagong-4310, Bangladesh";
  const phone = (contact?.phones && contact.phones[0]) || "+8801883352526";
  const email = contact?.email || "info@hotelthegrandalayna.com";
  const social = contact?.social || {};

  // sanitize phone for wa.me link (remove non-digits, keep leading +)
  const waPhone = phone ? phone.replace(/[^+0-9]/g, "") : "";

  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/Svg/Frame.svg" alt="Hotel The Grand Alayna logo" />
        </div>
        <div className="footer-info">
          <div className="contact-row">
            <div className="contact-icon">
              <FaLocationDot />
            </div>
            <div className="contact-label">Location</div>
            <div className="contact-value">{address}</div>
          </div>
          <div className="contact-row">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>
            <div className="contact-label">Phone</div>
            <div className="contact-value">{phone}</div>
          </div>
          <div className="contact-row">
            <div className="contact-icon">
              <MdEmail />
            </div>
            <div className="contact-label">Email Support</div>
            <div className="contact-value">{email}</div>
          </div>

          <div className="social-section-2">
            <div className="social-label-2">
              <span className="social-line-2" />
              <span className="follow-text-2">Follow us</span>
            </div>
            <div className="social-icons">
              {/* Only show icons that have a real link — no dead buttons */}
              {social.facebook && social.facebook !== "#" && (
                <a
                  href={social.facebook}
                  aria-label="Facebook"
                  className="facebook"
                >
                  <FaFacebook />
                </a>
              )}
              {(waPhone || (social.whatsapp && social.whatsapp !== "#")) && (
                <a
                  href={
                    waPhone
                      ? `https://wa.me/${waPhone.replace(/^\+/, "")}`
                      : social.whatsapp
                  }
                  aria-label="WhatsApp"
                  className="whatsapp"
                >
                  <FaWhatsapp />
                </a>
              )}
              {social.instagram && social.instagram !== "#" && (
                <a
                  href={social.instagram}
                  aria-label="Instagram"
                  className="instagram"
                >
                  <FaInstagram />
                </a>
              )}
              {social.youtube && social.youtube !== "#" && (
                <a
                  href={social.youtube}
                  aria-label="YouTube"
                  className="youtube"
                >
                  <FaYoutube />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

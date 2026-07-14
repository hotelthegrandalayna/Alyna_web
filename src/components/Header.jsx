import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import { RiHome2Line } from "react-icons/ri";
import { RiDoorOpenLine } from "react-icons/ri";
import { BsImage } from "react-icons/bs";
import { RiInformationLine } from "react-icons/ri";
import { RiContactsBookLine } from "react-icons/ri";

/* ── Icons used only in the mobile drawer ── */
const Icons = {
  Home: <RiHome2Line size={24} />,
  Rooms: <RiDoorOpenLine size={24} />,
  Gallery: <BsImage size={24} />,
  About: <RiInformationLine size={24} />,
  "Contact Us": <RiContactsBookLine size={24} />,
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeAll = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <nav className="navbar">
          <NavLink to="/" className="logo">
            <img src="/Svg/header_logo.svg" alt="Hotel The Grand Alayna logo" />
          </NavLink>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <div className="mobile-drawer-header">
              <button className="mobile-close-btn" onClick={closeAll}>
                ✕
              </button>
              <span className="mobile-drawer-title">Menu</span>
            </div>

            {navLinks.map((link) => (
              <li key={link.label} className="nav-item">
                <NavLink
                  to={link.href}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nav-icon">{Icons[link.label]}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div
        className={`mobile-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeAll}
      />
    </>
  );
}

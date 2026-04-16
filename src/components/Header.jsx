import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import { RiHome2Line } from "react-icons/ri";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { RiDoorOpenLine } from "react-icons/ri";
import { BsImage } from "react-icons/bs";
import { RiInformationLine } from "react-icons/ri";
import { RiContactsBookLine } from "react-icons/ri";

{
  /* <MdOutlineCancelPresentation /> */
}

/* ── Icons used only in the mobile drawer ── */
const Icons = {
  Home: <RiHome2Line size={24} />,
  Rooms: <RiDoorOpenLine size={24} />,
  Gallery: <BsImage size={24} />,
  About: <RiInformationLine size={24} />,
  "Contact Us": <RiContactsBookLine size={24} />,
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);

  const location = useLocation();
  const hoverTimer = useRef(null);

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Rooms",
      mobileLabel: "Room Categories",
      submenu: [
        { label: "The Serene Suite", href: "/room" },
        { label: "The Explorer's Basecamp", href: "/room2" },
      ],
    },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  // Close on route change
  useEffect(() => {
    setRoomOpen(false);
    setMenuOpen(false);
  }, [location]);

  // Cleanup hover timer
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Desktop hover handlers — untouched */
  const handleRoomsMouseEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setRoomOpen(true);
  };

  const handleRoomsMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setRoomOpen(false), 200);
  };

  const closeAll = () => {
    setMenuOpen(false);
    setRoomOpen(false);
  };

  return (
    <>
      <header className="header">
        <nav className="navbar">
          <NavLink to="/" className="logo">
            Alyna&apos;s <br /> Resort
          </NavLink>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            {/* Mobile-only header row — hidden on desktop via CSS */}
            <div className="mobile-drawer-header">
              <button
                className="mobile-close-btn"
                onClick={closeAll}
                aria-label="Close menu"
              >
                ✕
              </button>
              <span className="mobile-drawer-title">Menu</span>
            </div>

            {navLinks.map((link) => (
              <li
                key={link.label + location.pathname}
                className="nav-item"
                onMouseEnter={link.submenu ? handleRoomsMouseEnter : undefined}
                onMouseLeave={link.submenu ? handleRoomsMouseLeave : undefined}
              >
                {link.submenu ? (
                  <>
                    <div
                      className={`nav-parent ${roomOpen ? "active" : ""}`}
                      onClick={() => setRoomOpen(!roomOpen)}
                    >
                      {/* Icon — visible only on mobile via CSS */}
                      <span className="nav-icon">{Icons.Rooms}</span>

                      <span className="nav-label-desktop">{link.label}</span>
                      <span className="nav-label-mobile">{link.mobileLabel}</span>

                      {/* Arrow — visible only on mobile via CSS */}
                      <span className="nav-parent-arrow">
                        {roomOpen ? "▲" : "▼"}
                      </span>

                      {/* Desktop arrow — always shown, hidden on mobile via CSS would need
                          a separate span; the original used ▾ inline text */}
                      <span className="desktop-arrow"> ▾</span>
                    </div>

                    <ul className={`dropdown ${roomOpen ? "show" : ""}`}>
                      {link.submenu.map((sub) => (
                        <li key={sub.label}>
                          <NavLink
                            to={sub.href}
                            className={({ isActive }) =>
                              isActive ? "active" : ""
                            }
                            onClick={closeAll}
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <NavLink
                    to={link.href}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {/* Icon — visible only on mobile via CSS */}
                    <span className="nav-icon">{Icons[link.label]}</span>

                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Scrim — mobile only, closes menu on tap */}
      <div
        className={`mobile-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeAll}
        aria-hidden="true"
      />
    </>
  );
}

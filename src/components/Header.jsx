import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);

  const location = useLocation(); // 👈 detect route change
  const hoverTimer = useRef(null);

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Rooms",
      submenu: [
        { label: "The Serene Suite", href: "/room" },
        { label: "The Explorer's Basecamp", href: "/room2" },
      ],
    },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  // 🔥 CLOSE DROPDOWN ON ROUTE CHANGE
  useEffect(() => {
    setRoomOpen(false);
    setMenuOpen(false);
  }, [location]);

  // cleanup timer
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const handleRoomsMouseEnter = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setRoomOpen(true); // always force open
  };

  const handleRoomsMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setRoomOpen(false), 200);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <NavLink to="/" className="logo">
          Alyna&apos;s <br /> Resort
        </NavLink>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <li
              key={link.label + location.pathname} // 🔥 force re-render
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
                    {link.label} ▾
                  </div>

                  <ul className={`dropdown ${roomOpen ? "show" : ""}`}>
                    {link.submenu.map((sub) => (
                      <li key={sub.label}>
                        <NavLink
                          to={sub.href}
                          className={({ isActive }) =>
                            isActive ? "active" : ""
                          }
                          onClick={() => {
                            setMenuOpen(false);
                            setRoomOpen(false);
                          }}
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
                  {link.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

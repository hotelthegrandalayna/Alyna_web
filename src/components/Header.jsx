import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Rooms",
      submenu: [
        { label: "The Serene Suite", href: "/room" },
        { label: "The Explorer’s Basecamp", href: "/room2" },
      ],
    },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

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
            <li key={link.label} className="nav-item">
              {link.submenu ? (
                <>
                  <div
                    className="nav-parent"
                    onClick={() => setRoomOpen(!roomOpen)}
                  >
                    {link.label} ▾
                  </div>

                  <ul className={`dropdown ${roomOpen ? "show" : ""}`}>
                    {link.submenu.map((sub) => (
                      <li key={sub.label}>
                        <NavLink
                          to={sub.href}
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
                <NavLink to={link.href} onClick={() => setMenuOpen(false)}>
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

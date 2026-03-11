import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    {
      label: "Rooms",
      submenu: [
        { label: "Room 1", href: "/room" },
        { label: "Room 2", href: "/room2" },
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

        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.label} className="nav-item">
              {link.submenu ? (
                <>
                  <span
                    className={`nav-parent ${
                      link.submenu.some(
                        (sub) => window.location.pathname === sub.href,
                      )
                        ? "active"
                        : ""
                    }`}
                  >
                    {link.label}
                  </span>

                  <ul className="dropdown">
                    {link.submenu.map((sub) => (
                      <li key={sub.label}>
                        <NavLink
                          to={sub.href}
                          className={({ isActive }) =>
                            isActive ? "active" : ""
                          }
                          onClick={() => setMenuOpen(false)}
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

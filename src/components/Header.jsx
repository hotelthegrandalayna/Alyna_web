import { useState } from 'react';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Rooms', href: '#rooms' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Contact Us', href: '#contact' },
  ];

  return (
    <header className="header">
      <nav className="navbar">
        <a href="#home" className="logo">Alyna&apos;s Resort</a>
        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
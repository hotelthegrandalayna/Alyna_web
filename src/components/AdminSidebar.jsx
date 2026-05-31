import React from "react";
import "./Admin.css";

export default function AdminSidebar({ activeView, setActiveView }) {
  return (
    <aside className="admin-left-panel">
      <nav className="admin-nav" aria-label="Admin navigation">
        <button
          type="button"
          className={`admin-nav-item ${activeView === "home" ? "is-active" : ""}`}
          onClick={() => setActiveView("home")}
        >
          Home
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeView === "gallery" ? "is-active" : ""}`}
          onClick={() => setActiveView("gallery")}
        >
          Gallery
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeView === "room1" ? "is-active" : ""}`}
          onClick={() => setActiveView("room1")}
        >
          Room 1
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeView === "room2" ? "is-active" : ""}`}
          onClick={() => setActiveView("room2")}
        >
          Room 2
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeView === "about" ? "is-active" : ""}`}
          onClick={() => setActiveView("about")}
        >
          About
        </button>

        <button
          type="button"
          className={`admin-nav-item ${activeView === "contact" ? "is-active" : ""}`}
          onClick={() => setActiveView("contact")}
        >
          Contact
        </button>
      </nav>
    </aside>
  );
}

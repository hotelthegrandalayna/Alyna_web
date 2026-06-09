import React from "react";
import "./Admin.css";

export default function AdminSidebar({
  activeView,
  setActiveView,
  accommodations = [],
}) {
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

        <div
          style={{
            marginTop: 12,
            padding: "0 8px",
            fontSize: 12,
            color: "#777",
          }}
        >
          Rooms
        </div>
        {(accommodations || []).map((a) => {
          const key = `room-${a.id}`;
          return (
            <button
              key={key}
              type="button"
              className={`admin-nav-item ${activeView === key ? "is-active" : ""}`}
              onClick={() => setActiveView(key)}
            >
              {a.title || `Room ${a.id}`}
            </button>
          );
        })}

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

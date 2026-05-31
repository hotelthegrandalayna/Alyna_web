import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminCalendar from "./AdminCalendar";
import Reservations from "./Reservations";
import AdminEditor from "./AdminEditor";
import "./Admin.css";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("home");

  return (
    <section className="calendar-admin-shell">
      <div className="calendar-admin-backdrop" />

      <div className="admin-dashboard-layout">
        <AdminSidebar activeView={activeView} setActiveView={setActiveView} />

        <main className="admin-main-area">
          {activeView === "calendar" && <AdminCalendar />}
          {activeView === "reservations" && <Reservations />}

          {[
            "home",
            "gallery",
            "room1",
            "room2",
            "about",
            "contact",
          ].includes(activeView) && (
            <AdminEditor view={activeView} />
          )}
        </main>
      </div>
    </section>
  );
}

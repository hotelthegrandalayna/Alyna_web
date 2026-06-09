import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminCalendar from "./AdminCalendar";
import Reservations from "./Reservations";
import AdminEditor from "./AdminEditor";
import "./Admin.css";
import { supabase } from "../lib/supabaseClient";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("home");
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await supabase
          .from("accommodations")
          .select("id,title,slug")
          .order("id", { ascending: true });
        if (!mounted) return;
        setAccommodations(data || []);
      } catch (e) {
        console.error("Failed to load accommodations for admin sidebar", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="calendar-admin-shell">
      <div className="calendar-admin-backdrop" />

      <div className="admin-dashboard-layout">
        <AdminSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          accommodations={accommodations}
        />

        <main className="admin-main-area">
          {activeView === "calendar" && <AdminCalendar />}
          {activeView === "reservations" && <Reservations />}

          {(["home", "gallery", "about", "contact"].includes(activeView) ||
            activeView?.startsWith("room-") ||
            activeView?.startsWith("accom-")) && (
            <AdminEditor view={activeView} />
          )}
        </main>
      </div>
    </section>
  );
}

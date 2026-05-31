import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useCalendar } from "../context/CalendarContext";
import "./Admin.css";
const CATEGORIES = ["booked", "almost", "free"];
const ROOM_OPTIONS = [
  { id: "room", label: "Room 1" },
  { id: "room2", label: "Room 2" },
];

const CATEGORY_META = {
  booked: {
    label: "Booked",
    description: "Dates that are no longer available for guests.",
  },
  almost: {
    label: "Almost booked",
    description: "Dates with limited availability that need attention.",
  },
  free: {
    label: "Free",
    description: "Open dates ready to accept new reservations.",
  },
};

export default function AdminCalendar() {
  const { rooms, getRoomCalendar, addDate, removeDate } = useCalendar();
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [activeRoom, setActiveRoom] = useState("room");
  const [activeTab, setActiveTab] = useState("booked");
  const [selectedDate, setSelectedDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const roomCalendar = getRoomCalendar(activeRoom);

  const currentDates = {
    booked: roomCalendar.booked,
    almost: roomCalendar.almost,
    free: roomCalendar.free,
  };

  const statusCounts = {
    booked: roomCalendar.booked.length,
    almost: roomCalendar.almost.length,
    free: roomCalendar.free.length,
  };

  const activeMeta = CATEGORY_META[activeTab];
  const activeRoomLabel =
    ROOM_OPTIONS.find((room) => room.id === activeRoom)?.label || "Room";
  const sortedDates = [...(currentDates[activeTab] || [])].sort();

  const handleAdd = () => {
    if (!selectedDate) return;

    CATEGORIES.filter((c) => c !== activeTab).forEach((category) =>
      removeDate(activeRoom, category, selectedDate),
    );

    addDate(activeRoom, activeTab, selectedDate);
    setSelectedDate("");
  };

  const updateDateStatus = (roomId, date, newStatus) => {
    if (!roomId || !date || !newStatus) return;

    // remove from all categories then add to newStatus
    CATEGORIES.forEach((cat) => removeDate(roomId, cat, date));
    addDate(roomId, newStatus, date);
  };

  const handleDbUpsert = async (roomId, date, status) => {
    if (!roomId || !date || !status) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("calendar_dates").upsert([{ room: roomId, date, status }], { onConflict: ["room", "date"] });
      if (error) throw error;
      // keep local state in sync
      updateDateStatus(roomId, date, status);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // clear pending
      setPendingStatuses((p) => ({ ...p, [date]: undefined }));
    } catch (err) {
      console.error("DB upsert failed", err);
      alert("Failed to update calendar row in DB");
    } finally {
      setSaving(false);
    }
  };

  const handleDbDelete = async (roomId, date) => {
    if (!roomId || !date) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("calendar_dates").delete().eq("room", roomId).eq("date", date);
      if (error) throw error;
      // remove locally from all categories
      CATEGORIES.forEach((cat) => removeDate(roomId, cat, date));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("DB delete failed", err);
      alert("Failed to remove calendar row from DB");
    } finally {
      setSaving(false);
    }
  };

  const combinedDates = Array.from(
    new Set([
      ...((roomCalendar && roomCalendar.booked) || []),
      ...((roomCalendar && roomCalendar.almost) || []),
      ...((roomCalendar && roomCalendar.free) || []),
    ]),
  ).sort();

  const handleSave = async () => {
    setSaving(true);

    try {
      // remove existing rows for rooms
      await supabase.from("calendar_dates").delete().in("room", ["room", "room2"]);

      // build inserts
      const inserts = [];
      Object.entries(rooms).forEach(([roomId, dateObj]) => {
        Object.entries(dateObj).forEach(([status, arr]) => {
          (arr || []).forEach((d) => inserts.push({ room: roomId, date: d, status }));
        });
      });

      if (inserts.length > 0) {
        const { error } = await supabase.from("calendar_dates").insert(inserts);
        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save calendar to Supabase. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="calendar-admin-shell">
      <div className="calendar-admin-backdrop" />

      <div className="calendar-admin-layout">
        <div className="calendar-admin-hero">
          <p className="calendar-admin-eyebrow">Dashboard</p>
          <h2>Calendar availability manager</h2>

          <div className="calendar-admin-stats">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className={`calendar-admin-stat calendar-admin-stat--${cat}`}
              >
                <span>{CATEGORY_META[cat].label}</span>
                <strong>{statusCounts[cat]}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="calendar-admin-card">
          <div className="calendar-admin-card__header">
            <div>
              {/* <p className="calendar-admin-card__label">
                Availability controls
              </p> */}
              <h2>{activeMeta.label}</h2>
              <p>
                {activeRoomLabel}: {activeMeta.description}
              </p>
            </div>
          </div>

          <div
            className="calendar-admin-tabs"
            role="tablist"
            aria-label="Room selection"
          >
            {ROOM_OPTIONS.map((room) => (
              <button
                key={room.id}
                type="button"
                className={`calendar-admin-tab ${activeRoom === room.id ? "is-active" : ""}`}
                onClick={() => setActiveRoom(room.id)}
              >
                <span>{room.label}</span>
              </button>
            ))}
          </div>

          <div
            className="calendar-admin-tabs"
            role="tablist"
            aria-label="Date status"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`calendar-admin-tab ${activeTab === cat ? "is-active" : ""}`}
                onClick={() => setActiveTab(cat)}
              >
                <span>{CATEGORY_META[cat].label}</span>
                <strong>{statusCounts[cat]}</strong>
              </button>
            ))}
          </div>

          <div className="calendar-admin-panel">
            <div className="calendar-admin-add">
              <label className="calendar-admin-field">
                <span>Select a date</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>

              <button
                type="button"
                className="calendar-admin-add-button"
                onClick={handleAdd}
                disabled={!selectedDate}
              >
                Add to {activeMeta.label}
              </button>
            </div>

            <div className="calendar-admin-list-wrap">
              <div className="calendar-admin-list-header">
                <h3>{activeMeta.label} dates</h3>
                <span>{sortedDates.length} total</span>
              </div>

              <div className="calendar-admin-list">
                {sortedDates.length === 0 && (
                  <div className="calendar-admin-empty">
                    No dates added in this category yet.
                  </div>
                )}

                {sortedDates.map((date) => (
                  <div
                    key={date}
                    className={`calendar-admin-chip calendar-admin-chip--${activeTab}`}
                  >
                    <span>{date}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${date}`}
                      onClick={() => removeDate(activeRoom, activeTab, date)}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="calendar-admin-edit">
              <h3>Edit dates for {activeRoomLabel}</h3>
              {combinedDates.length === 0 && <div className="calendar-admin-empty">No dates to edit.</div>}

              {combinedDates.map((date) => {
                const currentStatus = roomCalendar.booked.includes(date)
                  ? "booked"
                  : roomCalendar.almost.includes(date)
                  ? "almost"
                  : "free";

                const pending = pendingStatuses[date] || currentStatus;

                return (
                  <div key={date} className="calendar-admin-edit-row">
                    <span className="calendar-admin-edit-date">{date}</span>
                    <select
                      value={pending}
                      onChange={(e) => setPendingStatuses((p) => ({ ...p, [date]: e.target.value }))}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <button type="button" className="calendar-admin-update-button" onClick={() => handleDbUpsert(activeRoom, date, pending)}>Update DB</button>
                    <button type="button" className="calendar-admin-chip-remove" onClick={() => handleDbDelete(activeRoom, date)}>Remove DB</button>
                  </div>
                );
              })}

              <div style={{ marginTop: 12 }}>
                <h4>Insert date</h4>
                <label className="calendar-admin-field" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                  <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button type="button" className="calendar-admin-add-button" onClick={() => { updateDateStatus(activeRoom, selectedDate, activeTab); setSelectedDate(""); }}>Set</button>
                </label>
              </div>
            </div>

            <div className="calendar-admin-savebar">
              <div className="calendar-admin-savebar__actions">
                {saved && (
                  <span className="calendar-admin-saved">
                    Saved successfully
                  </span>
                )}
                <button
                  type="button"
                  className="calendar-admin-save-button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save to Supabase"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useCalendar } from "../context/CalendarContext";
import "./Admin.css";

const DOC_REF = doc(db, "calendar", "dates");
const CATEGORIES = ["booked", "almost", "free"];

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
  const { booked, almostBooked, free, addDate, removeDate } = useCalendar();
  const [activeTab, setActiveTab] = useState("booked");
  const [selectedDate, setSelectedDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentDates = {
    booked,
    almost: almostBooked,
    free,
  };

  const statusCounts = {
    booked: booked.length,
    almost: almostBooked.length,
    free: free.length,
  };

  const activeMeta = CATEGORY_META[activeTab];
  const sortedDates = [...(currentDates[activeTab] || [])].sort();

  const handleAdd = () => {
    if (!selectedDate) return;

    CATEGORIES.filter((c) => c !== activeTab).forEach((c) =>
      removeDate(c, selectedDate),
    );

    addDate(activeTab, selectedDate);
    setSelectedDate("");
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await setDoc(DOC_REF, {
        booked,
        almost: almostBooked,
        free,
        updatedAt: new Date().toISOString(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Check Firebase config.");
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
          {/* <p className="calendar-admin-copy">
            Organize reservation dates, move availability between statuses, and
            push the latest calendar state to Firebase.
          </p> */}

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
              <p className="calendar-admin-card__label">
                Availability controls
              </p>
              <h2>{activeMeta.label}</h2>
              <p>{activeMeta.description}</p>
            </div>
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
                      onClick={() => removeDate(activeTab, date)}
                    >
                      ×
                    </button>
                  </div>
                ))}
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
                  {saving ? "Saving..." : "Save to Firebase"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

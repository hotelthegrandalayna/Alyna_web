import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useCalendar } from "../context/CalendarContext";

const DOC_REF = doc(db, "calendar", "dates");
const CATEGORIES = ["booked", "almost", "free"];

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

  const handleAdd = () => {
    if (!selectedDate) return;
    // Remove from other categories first
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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1>Calendar admin</h1>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, margin: "1rem 0" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "1px solid",
              borderColor: activeTab === cat ? "#888" : "#ccc",
              background: activeTab === cat ? "#f5f5f5" : "white",
              cursor: "pointer",
              fontWeight: activeTab === cat ? 500 : 400,
            }}
          >
            {cat === "almost"
              ? "Almost booked"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Add date */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!selectedDate}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: selectedDate ? "pointer" : "not-allowed",
          }}
        >
          Add to {activeTab}
        </button>
      </div>

      {/* Date list */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: "1.5rem",
        }}
      >
        {(currentDates[activeTab] || []).length === 0 && (
          <span style={{ color: "#999", fontSize: 14 }}>No dates yet</span>
        )}
        {[...(currentDates[activeTab] || [])].sort().map((date) => (
          <span
            key={date}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 8,
              background:
                activeTab === "booked"
                  ? "#FCEBEB"
                  : activeTab === "almost"
                    ? "#FAEEDA"
                    : "#EAF3DE",
              fontSize: 13,
            }}
          >
            {date}
            <button
              onClick={() => removeDate(activeTab, date)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "8px 24px",
          borderRadius: 8,
          border: "1px solid #ccc",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        {saving ? "Saving..." : "Save to Firebase"}
      </button>
      {saved && (
        <span style={{ marginLeft: 12, color: "green", fontSize: 13 }}>
          Saved successfully!
        </span>
      )}
    </div>
  );
}

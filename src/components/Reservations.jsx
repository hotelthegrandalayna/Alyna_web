import React, { useState } from "react";
import { useCalendar } from "../context/CalendarContext";
import "./Admin.css";

function ReservationForm({ onAdd }) {
  const { rooms } = useCalendar();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roomId: Object.keys(rooms)[0] || "room",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) {
      alert("Please provide name, start date and end date.");
      return;
    }

    setSaving(true);
    try {
      await onAdd({ ...form, status: "pending" });
      setForm({
        name: "",
        email: "",
        phone: "",
        roomId: Object.keys(rooms)[0] || "room",
        startDate: "",
        endDate: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add reservation");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <label>
        <span>Guest name</span>
        <input name="name" value={form.name} onChange={handleChange} />
      </label>

      <label>
        <span>Email</span>
        <input name="email" value={form.email} onChange={handleChange} />
      </label>

      <label>
        <span>Phone</span>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>

      <label>
        <span>Room</span>
        <select name="roomId" value={form.roomId} onChange={handleChange}>
          {Object.keys(rooms).map((r) => (
            <option value={r} key={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Start date</span>
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
      </label>

      <label>
        <span>End date</span>
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
      </label>

      <label>
        <span>Notes</span>
        <textarea name="notes" value={form.notes} onChange={handleChange} />
      </label>

      <div>
        <button className="calendar-admin-add-button" type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add Reservation"}
        </button>
      </div>
    </form>
  );
}

function ReservationList({ items, onDelete }) {
  if (!items || items.length === 0) {
    return <div className="calendar-admin-empty">No reservations yet.</div>;
  }

  return (
    <div className="reservation-list">
      {items.map((r) => (
        <div className="reservation-item" key={r.id}>
          <div className="reservation-main">
            <strong>{r.name}</strong>
            <div>{r.email || r.phone}</div>
            <div>
              {r.startDate} → {r.endDate} • {r.roomId}
            </div>
          </div>
          <div>
            <button className="calendar-admin-chip" onClick={() => onDelete(r.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Reservations() {
  const ctx = useCalendar();
  const { reservations = [], addReservation, removeReservation } = ctx;

  const handleAdd = async (payload) => {
    await addReservation(payload);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this reservation?")) return;
    await removeReservation(id);
  };

  return (
    <section className="calendar-admin-card">
      <div className="calendar-admin-card__header">
        <h2>Reservations</h2>
        <p>Create and manage reservations from the admin panel.</p>
      </div>

      <div className="calendar-admin-panel">
        <div style={{ marginBottom: "1rem" }}>
          <ReservationForm onAdd={handleAdd} />
        </div>

        <div className="calendar-admin-list-wrap">
          <div className="calendar-admin-list-header">
            <h3>All reservations</h3>
            <span>{reservations.length} total</span>
          </div>

          <div className="calendar-admin-list">
            <ReservationList items={reservations} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </section>
  );
}

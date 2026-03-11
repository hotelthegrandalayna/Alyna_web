import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./RoomCalender.css";

const booked = ["2026-01-08"];
const almostBooked = ["2026-01-07"];
const free = ["2026-01-10"];

export default function RoomCalendar() {
  const [date, setDate] = useState(new Date(2026, 0, 1));

  const getClass = ({ date }) => {
    const d = date.toISOString().split("T")[0];

    if (booked.includes(d)) return "day-red";
    if (almostBooked.includes(d)) return "day-orange";
    if (free.includes(d)) return "day-green";
  };

  return (
    <div className="calendar-wrapper">
      <Calendar onChange={setDate} value={date} tileClassName={getClass} />

      <div className="legend">
        <p>
          <span className="dot red"></span> All serene rooms are booked this day
        </p>
        <p>
          <span className="dot orange"></span> Most of the serene rooms are
          booked
        </p>
        <p>
          <span className="dot green"></span> Most of the serene rooms are free
          to book
        </p>
      </div>
    </div>
  );
}

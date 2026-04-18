import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./RoomCalender.css";
import { useCalendar } from "../context/CalendarContext";

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function RoomCalendar({ roomId = "room" }) {
  const [date, setDate] = useState(new Date());
  const { booked, almost, free } = useCalendar(roomId);

  const getClass = ({ date }) => {
    const d = formatLocalDate(date);

    if ((booked || []).includes(d)) return "day-red";
    if ((almost || []).includes(d)) return "day-orange";
    if ((free || []).includes(d)) return "day-green";
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

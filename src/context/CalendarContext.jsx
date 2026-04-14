import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext(null);

export function CalendarProvider({ children }) {
  const [booked, setBooked] = useState(['2026-01-08']);
  const [almostBooked, setAlmostBooked] = useState(['2026-01-07']);
  const [free, setFree] = useState(['2026-01-10']);

  const addDate = (category, date) => {
    if (!date) return;
    const d = date;
    if (category === 'booked') setBooked((s) => Array.from(new Set([...(s || []), d])));
    if (category === 'almost') setAlmostBooked((s) => Array.from(new Set([...(s || []), d])));
    if (category === 'free') setFree((s) => Array.from(new Set([...(s || []), d])));
  };

  const removeDate = (category, date) => {
    if (category === 'booked') setBooked((s) => (s || []).filter((x) => x !== date));
    if (category === 'almost') setAlmostBooked((s) => (s || []).filter((x) => x !== date));
    if (category === 'free') setFree((s) => (s || []).filter((x) => x !== date));
  };

  return (
    <CalendarContext.Provider value={{ booked, almostBooked, free, addDate, removeDate }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}

export default CalendarContext;

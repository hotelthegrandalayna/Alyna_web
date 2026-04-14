import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../components/firebaseConfig";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const CalendarContext = createContext(null);
const DOC_REF = doc(db, "calendar", "dates"); // single document approach

export function CalendarProvider({ children }) {
  const [booked, setBooked] = useState([]);
  const [almostBooked, setAlmostBooked] = useState([]);
  const [free, setFree] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener — all clients update instantly when admin saves
  useEffect(() => {
    const unsub = onSnapshot(DOC_REF, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setBooked(data.booked || []);
        setAlmostBooked(data.almost || []);
        setFree(data.free || []);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addDate = (category, date) => {
    if (!date) return;
    if (category === "booked")
      setBooked((s) => Array.from(new Set([...s, date])));
    if (category === "almost")
      setAlmostBooked((s) => Array.from(new Set([...s, date])));
    if (category === "free") setFree((s) => Array.from(new Set([...s, date])));
  };

  const removeDate = (category, date) => {
    if (category === "booked") setBooked((s) => s.filter((x) => x !== date));
    if (category === "almost")
      setAlmostBooked((s) => s.filter((x) => x !== date));
    if (category === "free") setFree((s) => s.filter((x) => x !== date));
  };

  return (
    <CalendarContext.Provider
      value={{ booked, almostBooked, free, addDate, removeDate, loading }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}

export default CalendarContext;

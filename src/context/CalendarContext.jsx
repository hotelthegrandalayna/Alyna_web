import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../components/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const CalendarContext = createContext(null);
const DOC_REF = doc(db, "calendar", "dates");

const EMPTY_ROOM_DATES = {
  booked: [],
  almost: [],
  free: [],
};

const DEFAULT_ROOMS = {
  room: { ...EMPTY_ROOM_DATES },
  room2: { ...EMPTY_ROOM_DATES },
};

const normalizeRoomDates = (roomData = {}) => ({
  booked: roomData.booked || [],
  almost: roomData.almost || [],
  free: roomData.free || [],
});

const normalizeCalendarData = (data = {}) => {
  const hasNestedRooms = data.rooms && typeof data.rooms === "object";

  if (hasNestedRooms) {
    return {
      room: normalizeRoomDates(data.rooms.room),
      room2: normalizeRoomDates(data.rooms.room2),
    };
  }

  return {
    room: {
      booked: data.booked || [],
      almost: data.almost || [],
      free: data.free || [],
    },
    room2: { ...EMPTY_ROOM_DATES },
  };
};

export function CalendarProvider({ children }) {
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(DOC_REF, (snap) => {
      if (snap.exists()) {
        setRooms(normalizeCalendarData(snap.data()));
      } else {
        setRooms(DEFAULT_ROOMS);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const getRoomCalendar = (roomId = "room") =>
    rooms[roomId] || EMPTY_ROOM_DATES;

  const addDate = (roomId, category, date) => {
    if (!roomId || !category || !date) return;

    setRooms((current) => {
      const roomData = current[roomId] || EMPTY_ROOM_DATES;

      return {
        ...current,
        [roomId]: {
          ...roomData,
          [category]: Array.from(new Set([...(roomData[category] || []), date])),
        },
      };
    });
  };

  const removeDate = (roomId, category, date) => {
    if (!roomId || !category || !date) return;

    setRooms((current) => {
      const roomData = current[roomId] || EMPTY_ROOM_DATES;

      return {
        ...current,
        [roomId]: {
          ...roomData,
          [category]: (roomData[category] || []).filter((x) => x !== date),
        },
      };
    });
  };

  return (
    <CalendarContext.Provider
      value={{ rooms, getRoomCalendar, addDate, removeDate, loading }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(roomId) {
  const ctx = useContext(CalendarContext);

  if (!ctx) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }

  if (!roomId) {
    return ctx;
  }

  const roomData = ctx.getRoomCalendar(roomId);

  return {
    ...roomData,
    addDate: (category, date) => ctx.addDate(roomId, category, date),
    removeDate: (category, date) => ctx.removeDate(roomId, category, date),
    loading: ctx.loading,
  };
}

export default CalendarContext;

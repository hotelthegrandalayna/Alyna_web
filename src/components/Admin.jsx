import React, { useState } from "react";
import AdminCalendar from "./AdminCalendar";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState("");

  if (!auth)
    return (
      <div style={{ padding: "2rem" }}>
        <input
          type="password"
          placeholder="Enter password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <button
          onClick={() => {
            if (pwd === "Admin1234@") setAuth(true);
            else alert("Wrong password");
          }}
        >
          Login
        </button>
      </div>
    );

  return <AdminCalendar />;
}

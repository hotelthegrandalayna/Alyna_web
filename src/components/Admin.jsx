import React, { useState } from "react";
import AdminCalendar from "./AdminCalendar";
import "./Admin.css";

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "Admin1234@";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username !== ADMIN_USERNAME) {
      setError("Incorrect username. Use the authorized admin account.");
      return;
    }

    if (pwd !== ADMIN_PASSWORD) {
      setError("Incorrect password. Please try again.");
      return;
    }

    setError("");
    setAuth(true);
  };

  if (!auth) {
    return (
      <section className="admin-auth-shell">
        <div className="admin-auth-backdrop" />
        <div className="admin-auth-layout">
          <div className="admin-auth-intro">
            <p className="admin-auth-eyebrow">Secure Access</p>
            <h1>Admin control panel login</h1>
            {/* <p className="admin-auth-copy">
              Sign in to manage the booking calendar and keep room availability
              updated in real time.
            </p>

            <div className="admin-auth-highlights">
              <div className="admin-highlight-card">
                <span>Live updates</span>
                <strong>Sync changes directly to Firebase</strong>
              </div>
              <div className="admin-highlight-card">
                <span>Protected route</span>
                <strong>Username and password required</strong>
              </div>
            </div> */}
          </div>

          <form className="admin-login-card" onSubmit={handleLogin}>
            <div className="admin-login-card__header">
              <h2>Administrator Sign In</h2>
              <p>Use your admin credentials to continue.</p>
            </div>

            <label className="admin-field">
              <span>Username</span>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
              />
            </label>

            <label className="admin-field">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter password"
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value);
                  if (error) setError("");
                }}
              />
            </label>

            {error && <p className="admin-login-error">{error}</p>}

            <button className="admin-login-button" type="submit">
              Login to Dashboard
            </button>

            <p className="admin-login-hint">
              Authorized username: <strong>{ADMIN_USERNAME}</strong>
            </p>
          </form>
        </div>
      </section>
    );
  }

  return <AdminCalendar />;
}

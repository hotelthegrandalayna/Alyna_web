import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import SEO from "./SEO";
import { supabase } from "../lib/supabaseClient";
import "./Admin.css";

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: dbError } = await supabase.rpc("login_user", {
      p_email: email,
      p_password: pwd,
    });

    setLoading(false);

    if (dbError || !data || data.length === 0) {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    const user = data[0];

    if (user.role !== "admin" && user.role !== "moderator") {
      setError("You are not authorized to access the dashboard.");
      return;
    }

    setError("");
    setCurrentUser(user);
    setAuth(true);
  };

  if (!auth) {
    return (
      <section className="admin-auth-shell">
        <SEO title="Admin" path="/admin" noindex />
        <div className="admin-auth-backdrop" />
        <div className="admin-auth-layout">
          <form className="admin-login-card" onSubmit={handleLogin}>
            <div className="admin-login-card__header">
              <h2 style={{ textAlign: "center" }}>Log In</h2>
              <p>Use your admin credentials to continue.</p>
            </div>

            <label className="admin-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
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

            <button
              className="admin-login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return <AdminDashboard user={currentUser} />;
}

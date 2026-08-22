/**
 * The owner's control panel. One page, one link:
 *
 *   https://hotelthegrandalayna.com/.netlify/functions/admin?key=YOUR_BOT_SWITCH_KEY
 *
 * Everything here is text and numbers — no keys, no tokens. Those stay in
 * Netlify where only the owner can see them, so a leaked link cannot expose
 * anything that costs money.
 *
 * The point of this page is that the day-to-day work belongs to the owner, not
 * to a developer. A guest asks something the bot does not know on Monday; the
 * owner sees it here on Friday and types the answer in. No deploy, no waiting.
 */
import { cfg } from "./lib/config.js";
import {
  getSettings,
  saveSettings,
  recentLeads,
  recentHandoffs,
} from "./lib/store.js";
import { HOTEL_KNOWLEDGE } from "./lib/knowledge.js";

export default async function handler(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  const secret = process.env.BOT_ADMIN_KEY || process.env.BOT_SWITCH_KEY || "";

  if (!secret) return html(page({ error: "BOT_SWITCH_KEY is not set in Netlify." }), 200);
  if (key !== secret) return new Response("forbidden", { status: 403 });

  let notice = "";

  if (req.method === "POST") {
    const form = await req.formData();
    const action = form.get("action");

    if (action === "toggle") {
      const err = await saveSettings({ enabled: form.get("enabled") === "on" });
      notice = err ? `Could not save: ${err}` : "Saved.";
    }

    if (action === "knowledge") {
      const text = String(form.get("knowledge") || "").trim();
      // Empty means "go back to the version built into the site", which is the
      // safety net: clearing the box can never leave the bot knowing nothing.
      const err = await saveSettings({ knowledge: text || null });
      notice = err
        ? `Could not save: ${err}`
        : text
        ? "Saved. The next guest message uses this."
        : "Cleared — back to the version built into the site.";
    }

    if (action === "settings") {
      const cap = parseInt(form.get("max_replies_per_chat") || "", 10);
      const pause = parseFloat(form.get("staff_pause_hours") || "");
      const err = await saveSettings({
        max_replies_per_chat: Number.isFinite(cap) ? cap : null,
        staff_pause_hours: Number.isFinite(pause) ? pause : null,
      });
      notice = err ? `Could not save: ${err}` : "Saved.";
    }

    // Redirect after saving so a refresh does not repeat the change.
    return new Response("", {
      status: 303,
      headers: { Location: `${url.pathname}?key=${encodeURIComponent(key)}&msg=${encodeURIComponent(notice)}` },
    });
  }

  const [settings, leads, handoffs] = await Promise.all([
    getSettings(),
    recentLeads(25),
    recentHandoffs(40),
  ]);

  return html(
    page({
      key,
      settings,
      leads,
      handoffs,
      notice: url.searchParams.get("msg") || "",
      fallbackKnowledge: HOTEL_KNOWLEDGE,
    })
  );
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function when(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { timeZone: "Asia/Dhaka", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function page({ key, settings = {}, leads = [], handoffs = [], notice = "", error = "", fallbackKnowledge = "" }) {
  if (error) return shell(`<div class="card"><p class="bad">${esc(error)}</p></div>`);

  const on = settings.enabled !== false;
  const usingOwn = Boolean(settings.knowledge);
  const knowledge = settings.knowledge || fallbackKnowledge;
  const cap = settings.max_replies_per_chat ?? cfg.maxRepliesPerChat;
  const pause = settings.staff_pause_hours ?? cfg.handoffPauseHours;
  const k = encodeURIComponent(key);

  const leadRows = leads.length
    ? leads
        .map(
          (l) => `<tr>
        <td>${esc(l.name || "—")}</td>
        <td>${esc(l.phone || "—")}</td>
        <td>${esc(l.checkin || "—")}${l.checkout ? " → " + esc(l.checkout) : ""}</td>
        <td>${esc(l.guests ?? "—")}</td>
        <td>${esc(l.room_pref || "—")}</td>
        <td class="dim">${esc(when(l.created_at))}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="6" class="dim">No enquiries yet.</td></tr>`;

  const handoffRows = handoffs.length
    ? handoffs
        .map(
          (h) => `<tr>
        <td>${esc(h.name || "—")}</td>
        <td>${esc(h.handoff_reason)}</td>
        <td class="dim">${esc(when(h.updated_at))}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="3" class="dim">Nothing yet.</td></tr>`;

  return shell(`
  ${notice ? `<div class="notice">${esc(notice)}</div>` : ""}

  <div class="card">
    <div class="row">
      <div>
        <h2><span class="dot ${on ? "green" : "red"}"></span>Coordinator is ${on ? "ON" : "OFF"}</h2>
        <p class="dim">${on ? "Answering guest messages normally." : "Not replying to anyone. Guests get silence until you turn it back on."}</p>
      </div>
      <form method="post" action="?key=${k}">
        <input type="hidden" name="action" value="toggle">
        <input type="hidden" name="enabled" value="${on ? "off" : "on"}">
        <button class="${on ? "danger" : "go"}">${on ? "Turn OFF" : "Turn ON"}</button>
      </form>
    </div>
  </div>

  <div class="card">
    <h2>What it knows</h2>
    <p class="dim">
      ${usingOwn
        ? "Using your edited version."
        : "Using the version built into the site. Editing here takes over from it."}
      Saving applies to the very next guest message — no deploy.
      Empty the box and save to go back to the built-in version.
    </p>
    <form method="post" action="?key=${k}">
      <input type="hidden" name="action" value="knowledge">
      <textarea name="knowledge" spellcheck="false">${esc(knowledge)}</textarea>
      <button class="go">Save what it knows</button>
    </form>
  </div>

  <div class="card">
    <h2>Settings</h2>
    <form method="post" action="?key=${k}" class="settings">
      <input type="hidden" name="action" value="settings">
      <label>
        <span>Hand over to a person after this many replies</span>
        <input type="number" name="max_replies_per_chat" min="1" max="100" value="${esc(cap)}">
        <small class="dim">Lower means more conversations reach you, and a smaller bill. 10 is a sensible start.</small>
      </label>
      <label>
        <span>Stay quiet for this many hours after you reply by hand</span>
        <input type="number" name="staff_pause_hours" min="0" max="72" step="0.5" value="${esc(pause)}">
        <small class="dim">Once you answer a guest yourself, the bot stops talking over you for this long.</small>
      </label>
      <button class="go">Save settings</button>
    </form>
  </div>

  <div class="card">
    <h2>Questions it could not answer</h2>
    <p class="dim">Every one of these is something worth adding above. The same question usually appears several times before anyone notices it is missing.</p>
    <table><thead><tr><th>Guest</th><th>Why it needed a person</th><th>When</th></tr></thead><tbody>${handoffRows}</tbody></table>
  </div>

  <div class="card">
    <h2>Booking enquiries</h2>
    <table><thead><tr><th>Name</th><th>Phone</th><th>Dates</th><th>Guests</th><th>Room</th><th>When</th></tr></thead><tbody>${leadRows}</tbody></table>
  </div>
  `);
}

function shell(inner) {
  return `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Coordinator</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;background:#f4f2f8;color:#1e1b24;font:15px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;padding:20px}
  .wrap{max-width:840px;margin:0 auto}
  h1{font-size:22px;margin:6px 0 20px}
  h2{font-size:17px;margin:0 0 6px}
  .card{background:#fff;border:1px solid #e6e2ee;border-radius:12px;padding:20px;margin-bottom:16px}
  .row{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
  .dim{color:#6d6880;font-size:13.5px;margin:0 0 10px}
  .dot{width:11px;height:11px;border-radius:50%;display:inline-block;margin-right:8px}
  .green{background:#2e9e63}.red{background:#c94a4a}
  textarea{width:100%;height:340px;font:12.5px/1.55 ui-monospace,Menlo,Consolas,monospace;
           padding:12px;border:1px solid #ddd8e6;border-radius:8px;background:#fbfafd;resize:vertical}
  button{border:0;border-radius:8px;padding:11px 18px;font-size:15px;font-weight:600;cursor:pointer;margin-top:12px}
  .go{background:#6547db;color:#fff}
  .danger{background:#fdeaea;color:#b03535;border:1px solid #f0c4c4;margin-top:0}
  .settings label{display:block;margin-bottom:18px}
  .settings span{display:block;font-weight:600;margin-bottom:4px}
  .settings input{width:110px;padding:9px;border:1px solid #ddd8e6;border-radius:8px;font-size:15px}
  .settings small{display:block;margin-top:4px}
  table{width:100%;border-collapse:collapse;font-size:13.5px}
  th{text-align:left;color:#6d6880;font-weight:600;border-bottom:1px solid #e6e2ee;padding:8px 10px 8px 0}
  td{padding:9px 10px 9px 0;border-bottom:1px solid #f1eef7;vertical-align:top}
  .notice{background:#e8f6ee;border:1px solid #bfe3cd;color:#1f6b42;padding:11px 15px;border-radius:8px;margin-bottom:16px}
  .bad{color:#b03535}
  @media(max-width:600px){body{padding:12px}.card{padding:16px}table{font-size:12.5px}}
</style>
<div class="wrap">
  <h1>Hotel The Grand Alayna — Coordinator</h1>
  ${inner}
</div>`;
}

/**
 * Database access over Supabase's REST API, using plain fetch.
 *
 * Deliberately NOT using @supabase/supabase-js here. That client builds a
 * realtime websocket connection the moment it is created, and on Node 20 it
 * throws "Node.js 20 detected without native WebSocket support" before doing any
 * work at all. Netlify sets the function runtime's Node version separately from
 * the build's, so we cannot guarantee Node 22 — and a bot that dies on the
 * runtime's version is not worth the convenience. We only ever read and write
 * rows, so REST does everything we need with no dependency.
 */
import { cfg } from "./config.js";

function base() {
  return `${cfg.supabaseUrl.replace(/\/$/, "")}/rest/v1`;
}

function headers(extra = {}) {
  return {
    apikey: cfg.supabaseServiceKey,
    Authorization: `Bearer ${cfg.supabaseServiceKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function get(table, query) {
  const res = await fetch(`${base()}/${table}?${query}`, { headers: headers() });
  if (!res.ok) {
    console.warn(`select ${table} failed:`, res.status, (await res.text()).slice(0, 160));
    return [];
  }
  return res.json();
}

/** Row count without fetching the rows. */
async function count(table, query) {
  const res = await fetch(`${base()}/${table}?${query}&select=id&limit=1`, {
    headers: headers({ Prefer: "count=exact" }),
  });
  if (!res.ok) return 0;
  const range = res.headers.get("content-range") || ""; // e.g. "0-0/42"
  const total = parseInt(range.split("/")[1] || "", 10);
  return Number.isFinite(total) ? total : 0;
}

/* ---------- settings ---------- */

export async function getSettings() {
  const rows = await get("bot_settings", "id=eq.1&select=*");
  return rows[0] || { enabled: true, knowledge: null, persona_notes: null };
}

/**
 * The live room list, straight from the table the website itself reads.
 * When the owner changes a price on the website, the bot changes with it.
 */
export async function getLiveRooms() {
  const rows = await get("accommodations", "select=title,price,tags,description&order=price.asc");
  return rows.length ? rows : null;
}

/* ---------- threads ---------- */

export async function getThread(psid) {
  const rows = await get("fb_threads", `psid=eq.${encodeURIComponent(psid)}&select=*`);
  return rows[0] || null;
}

export async function upsertThread(psid, patch) {
  const res = await fetch(`${base()}/fb_threads?on_conflict=psid`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify({ psid, ...patch, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    console.warn("upsertThread failed:", res.status, (await res.text()).slice(0, 160));
    return null;
  }
  return (await res.json())[0] || null;
}

export function isPaused(thread) {
  if (!thread?.bot_paused_until) return false;
  return new Date(thread.bot_paused_until).getTime() > Date.now();
}

export async function pauseBot(psid, hours, reason) {
  const until = new Date(Date.now() + hours * 3600 * 1000).toISOString();
  await upsertThread(psid, { bot_paused_until: until, needs_human: true, handoff_reason: reason || null });
}

/* ---------- messages ---------- */

/**
 * Store one message.
 * `isNew` is false when Facebook re-delivered a message we already handled.
 * `createdAt` comes back from the database so every later comparison uses the
 * database's clock, not the server's — the two are never exactly in step.
 */
export async function recordMessage({ psid, mid, role, text, attachments }) {
  const res = await fetch(`${base()}/fb_messages`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify({
      psid,
      mid: mid || null,
      role,
      text: text || null,
      attachments: attachments || null,
    }),
  });

  if (res.status === 409) return { isNew: false, createdAt: null }; // duplicate mid
  if (!res.ok) {
    const body = await res.text();
    if (body.includes("23505")) return { isNew: false, createdAt: null };
    console.warn("recordMessage failed:", res.status, body.slice(0, 160));
    return { isNew: true, createdAt: null };
  }
  const rows = await res.json();
  return { isNew: true, createdAt: rows[0]?.created_at || null };
}

export async function getHistory(psid, limit) {
  const rows = await get(
    "fb_messages",
    `psid=eq.${encodeURIComponent(psid)}&select=role,text,created_at&order=created_at.desc&limit=${limit}`
  );
  return rows.reverse();
}

/** True if a newer guest message arrived while we were waiting — someone else will answer. */
export async function newerGuestMessageExists(psid, sinceIso) {
  const rows = await get(
    "fb_messages",
    `psid=eq.${encodeURIComponent(psid)}&role=eq.guest&created_at=gt.${encodeURIComponent(sinceIso)}&select=id&limit=1`
  );
  return rows.length > 0;
}

/** Replies the bot has sent this guest recently — i.e. in this conversation. */
export async function countRecentBotMessages(psid, hoursBack = 24) {
  const since = new Date(Date.now() - hoursBack * 3600 * 1000).toISOString();
  return count(
    "fb_messages",
    `psid=eq.${encodeURIComponent(psid)}&role=eq.bot&created_at=gt.${encodeURIComponent(since)}`
  );
}

export async function countGuestMessages(psid) {
  return count("fb_messages", `psid=eq.${encodeURIComponent(psid)}&role=eq.guest`);
}

/* ---------- leads ---------- */

export async function saveLead(psid, lead) {
  if (!lead) return;
  const clean = {
    psid,
    name: lead.name || null,
    phone: lead.phone || null,
    checkin: lead.checkin || null,
    checkout: lead.checkout || null,
    guests: Number.isFinite(lead.guests) ? lead.guests : null,
    room_pref: lead.room_pref || null,
    notes: lead.notes || null,
    updated_at: new Date().toISOString(),
  };
  const hasSomething = Object.entries(clean).some(
    ([k, v]) => k !== "psid" && k !== "updated_at" && v
  );
  if (!hasSomething) return;

  const existing = await get(
    "fb_leads",
    `psid=eq.${encodeURIComponent(psid)}&status=in.(new,contacted)&select=id&order=created_at.desc&limit=1`
  );

  if (existing[0]) {
    // Only fill in blanks — never wipe something already known with a null.
    const merged = {};
    for (const [k, v] of Object.entries(clean)) if (v != null) merged[k] = v;
    const res = await fetch(`${base()}/fb_leads?id=eq.${existing[0].id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(merged),
    });
    if (!res.ok) console.warn("lead update failed:", res.status, (await res.text()).slice(0, 160));
  } else {
    const res = await fetch(`${base()}/fb_leads`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ ...clean, status: "new" }),
    });
    if (!res.ok) console.warn("lead insert failed:", res.status, (await res.text()).slice(0, 160));
  }
}

/** Turn the whole bot on or off. Returns an error string, or null on success. */
export async function setEnabled(enabled) {
  const res = await fetch(`${base()}/bot_settings?on_conflict=id`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify({ id: 1, enabled, updated_at: new Date().toISOString() }),
  });
  return res.ok ? null : `${res.status} ${(await res.text()).slice(0, 120)}`;
}

/**
 * Did the bot itself send this message?
 *
 * Every reply the bot sends is echoed straight back to the webhook by Facebook.
 * If we mistake our own echo for a staff member replying by hand, the bot pauses
 * itself for hours after every single reply — it answers once and goes silent.
 *
 * Two checks, because the first is exact but not always available:
 *   1. the message id, which we store when we send
 *   2. failing that, identical text sent by the bot in the last few minutes
 */
export async function wasSentByBot(psid, mid, text, withinMs = 5 * 60 * 1000) {
  if (mid) {
    const byMid = await get(
      "fb_messages",
      `mid=eq.${encodeURIComponent(mid)}&role=eq.bot&select=id&limit=1`
    );
    if (byMid.length) return true;
  }
  if (!text) return false;

  const since = new Date(Date.now() - withinMs).toISOString();
  const recent = await get(
    "fb_messages",
    `psid=eq.${encodeURIComponent(psid)}&role=eq.bot&created_at=gt.${encodeURIComponent(since)}&select=text&limit=10`
  );
  const norm = (s) => String(s || "").trim();
  return recent.some((r) => norm(r.text) === norm(text));
}

/**
 * Claim the right to reply to this conversation. Returns false if another run
 * already holds it.
 *
 * Facebook can deliver the same event twice, and a background invoke that looks
 * failed may still be running. Without this, one guest message produced two
 * overlapping replies saying the same thing in different words — confusing to
 * read, and paid for twice.
 *
 * The claim expires on its own so a crashed run cannot lock a guest out.
 */
export async function claimReply(psid, staleAfterMs = 90 * 1000) {
  const thread = await getThread(psid);
  const since = thread?.replying_since ? new Date(thread.replying_since).getTime() : 0;
  if (since && Date.now() - since < staleAfterMs) return false; // someone else is mid-reply
  await upsertThread(psid, { replying_since: new Date().toISOString() });
  return true;
}

export async function releaseReply(psid) {
  await upsertThread(psid, { replying_since: null });
}

/**
 * How many replies the bot has sent in THIS conversation.
 *
 * Not "in the last 24 hours" — that was the first version, and it meant a guest
 * who messaged in the morning and again at night opened their second chat
 * already over the limit, so "hello" was answered with "I'm passing you to
 * reception". A conversation is whatever has happened since the last long quiet
 * period, which is how a person would think about it too.
 */
export async function countRepliesThisConversation(psid, gapMs = 2 * 60 * 60 * 1000) {
  const rows = await get(
    "fb_messages",
    `psid=eq.${encodeURIComponent(psid)}&select=role,created_at&order=created_at.desc&limit=80`
  );
  let replies = 0;
  let newer = null;
  for (const r of rows) {
    const t = new Date(r.created_at).getTime();
    if (newer !== null && newer - t > gapMs) break; // a quiet gap — earlier conversation
    if (r.role === "bot") replies++;
    newer = t;
  }
  return replies;
}

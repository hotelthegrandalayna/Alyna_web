import { createClient } from "@supabase/supabase-js";
import { cfg } from "./config.js";

let _db = null;
export function db() {
  if (!_db) {
    _db = createClient(cfg.supabaseUrl, cfg.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _db;
}

/* ---------- settings ---------- */

export async function getSettings() {
  const { data, error } = await db().from("bot_settings").select("*").eq("id", 1).maybeSingle();
  if (error) console.warn("bot_settings read failed:", error.message);
  return data || { enabled: true, knowledge: null, persona_notes: null };
}

/* ---------- threads ---------- */

export async function getThread(psid) {
  const { data } = await db().from("fb_threads").select("*").eq("psid", psid).maybeSingle();
  return data || null;
}

export async function upsertThread(psid, patch) {
  const { data, error } = await db()
    .from("fb_threads")
    .upsert({ psid, ...patch, updated_at: new Date().toISOString() }, { onConflict: "psid" })
    .select()
    .maybeSingle();
  if (error) console.warn("upsertThread failed:", error.message);
  return data;
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
  const row = { psid, mid: mid || null, role, text: text || null, attachments: attachments || null };
  const { data, error } = await db().from("fb_messages").insert(row).select("created_at").maybeSingle();
  if (error) {
    if (error.code === "23505") return { isNew: false, createdAt: null }; // duplicate mid
    console.warn("recordMessage failed:", error.message);
    return { isNew: true, createdAt: null };
  }
  return { isNew: true, createdAt: data?.created_at || null };
}

export async function getHistory(psid, limit) {
  const { data } = await db()
    .from("fb_messages")
    .select("role, text, created_at")
    .eq("psid", psid)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data || []).reverse();
}

/** True if a newer guest message arrived while we were waiting — someone else will answer. */
export async function newerGuestMessageExists(psid, sinceIso) {
  const { data } = await db()
    .from("fb_messages")
    .select("id")
    .eq("psid", psid)
    .eq("role", "guest")
    .gt("created_at", sinceIso)
    .limit(1);
  return (data || []).length > 0;
}

/** Replies the bot has sent this guest in the last `hoursBack` hours — i.e. this conversation. */
export async function countRecentBotMessages(psid, hoursBack = 24) {
  const since = new Date(Date.now() - hoursBack * 3600 * 1000).toISOString();
  const { count } = await db()
    .from("fb_messages")
    .select("id", { count: "exact", head: true })
    .eq("psid", psid)
    .eq("role", "bot")
    .gt("created_at", since);
  return count || 0;
}

export async function countGuestMessages(psid) {
  const { count } = await db()
    .from("fb_messages")
    .select("id", { count: "exact", head: true })
    .eq("psid", psid)
    .eq("role", "guest");
  return count || 0;
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
  const hasSomething = Object.entries(clean).some(([k, v]) => k !== "psid" && k !== "updated_at" && v);
  if (!hasSomething) return;

  const { data: existing } = await db()
    .from("fb_leads")
    .select("*")
    .eq("psid", psid)
    .in("status", ["new", "contacted"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    // only fill in blanks / overwrite with newer non-null info
    const merged = { ...clean };
    for (const k of Object.keys(clean)) if (clean[k] == null) delete merged[k];
    await db().from("fb_leads").update(merged).eq("id", existing.id);
  } else {
    await db().from("fb_leads").insert({ ...clean, status: "new" });
  }
}

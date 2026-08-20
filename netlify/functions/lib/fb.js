import crypto from "node:crypto";
import { cfg } from "./config.js";

const PAGE_INBOX_APP_ID = "263902037430900"; // Meta's Page Inbox, for handover protocol

function graph(path) {
  return `https://graph.facebook.com/${cfg.graphVersion}/${path}`;
}

async function post(path, body) {
  const res = await fetch(`${graph(path)}?access_token=${encodeURIComponent(cfg.pageToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`FB ${path} ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

export function sendAction(psid, action) {
  // action: mark_seen | typing_on | typing_off
  return post("me/messages", { recipient: { id: psid }, sender_action: action });
}

export function sendText(psid, text) {
  return post("me/messages", {
    recipient: { id: psid },
    messaging_type: "RESPONSE",
    message: { text },
  });
}

export async function getProfile(psid) {
  try {
    const res = await fetch(
      `${graph(psid)}?fields=first_name,last_name&access_token=${encodeURIComponent(cfg.pageToken)}`
    );
    if (!res.ok) return null;
    const j = await res.json();
    const name = [j.first_name, j.last_name].filter(Boolean).join(" ").trim();
    return name || null;
  } catch {
    return null; // profile access needs extra permissions; the bot works fine without it
  }
}

/** Hand the conversation to the human Page Inbox (optional, needs handover protocol setup). */
export async function passToInbox(psid, reason) {
  if (!cfg.passToInbox) return;
  try {
    await post("me/pass_thread_control", {
      recipient: { id: psid },
      target_app_id: PAGE_INBOX_APP_ID,
      metadata: reason || "handoff",
    });
  } catch (e) {
    console.warn("pass_thread_control failed (safe to ignore if not configured):", e.message);
  }
}

/** Verify X-Hub-Signature-256 so nobody but Facebook can post to the webhook. */
export function verifySignature(rawBody, header) {
  if (!cfg.appSecret) return true; // not configured — skip (set FB_APP_SECRET in production)
  if (!header || !header.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", cfg.appSecret).update(rawBody, "utf8").digest("hex");
  const got = header.slice(7);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(got, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

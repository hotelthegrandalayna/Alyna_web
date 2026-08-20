/**
 * Facebook Messenger webhook.
 *
 * Webhook URL to give Meta:
 *   https://hotelthegrandalayna.com/.netlify/functions/messenger
 *
 * This function only receives, stores and de-duplicates. The actual reply runs
 * in messenger-reply-background.js so Facebook always gets its 200 instantly.
 */
import { cfg, missingConfig } from "./lib/config.js";
import * as fb from "./lib/fb.js";
import * as store from "./lib/store.js";
import { handleTurn } from "./lib/turn.js";
import { internalSecret } from "./lib/secret.js";

const STALE_EVENT_MS = 10 * 60 * 1000; // ignore webhook replays older than 10 minutes

export default async function handler(req) {
  /* ---- Meta's one-time verification handshake ---- */
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token && token === cfg.verifyToken) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("forbidden", { status: 403 });
  }

  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const missing = missingConfig();
  if (missing.length) {
    console.error("missing env vars:", missing.join(", "));
    return new Response("EVENT_RECEIVED", { status: 200 }); // never make Meta retry on our config error
  }

  const raw = await req.text();
  if (!fb.verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("bad signature", { status: 403 });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("EVENT_RECEIVED", { status: 200 });
  }
  if (body.object !== "page") return new Response("EVENT_RECEIVED", { status: 200 });

  const origin = new URL(req.url).origin;

  for (const entry of body.entry || []) {
    for (const ev of entry.messaging || []) {
      try {
        await handleEvent(ev, entry.id, origin);
      } catch (e) {
        console.error("event failed:", e?.message || e);
      }
    }
  }

  return new Response("EVENT_RECEIVED", { status: 200 });
}

async function handleEvent(ev, pageId, origin) {
  if (!ev.message && !ev.postback) return;              // read receipts, delivery — ignore
  if (ev.message?.is_deleted) return;
  if (ev.timestamp && Date.now() - ev.timestamp > STALE_EVENT_MS) return;

  /* ---- A message sent BY the page ---- */
  if (ev.message?.is_echo) {
    const fromOurBot = cfg.appId && String(ev.message.app_id || "") === String(cfg.appId);
    if (fromOurBot) return; // our own reply, already stored

    // A human replied from the Page Inbox. Step back and let them own the chat.
    const psid = ev.recipient?.id;
    if (!psid) return;
    await store.recordMessage({
      psid,
      mid: ev.message.mid,
      role: "staff",
      text: ev.message.text || "(staff sent an attachment)",
    });
    await store.pauseBot(psid, cfg.handoffPauseHours, "staff replied by hand");
    console.log(`bot paused for ${psid} — staff replied`);
    return;
  }

  const psid = ev.sender?.id;
  if (!psid) return;

  const text = ev.message?.text || ev.postback?.payload || ev.postback?.title || "";
  const attachments = ev.message?.attachments || null;
  const shown = text || describeAttachments(attachments);
  if (!shown) return;

  const { isNew, createdAt } = await store.recordMessage({
    psid,
    mid: ev.message?.mid || null,
    role: "guest",
    text: shown,
    attachments,
  });
  if (!isNew) return; // Facebook re-delivered a message we already answered

  // Use the database's own timestamp for this message, so the "is the guest
  // still typing?" check later compares like with like.
  const receivedAtIso = createdAt || new Date().toISOString();
  await store.upsertThread(psid, {
    page_id: pageId,
    last_user_msg_at: receivedAtIso,
  });

  await triggerReply({ psid, receivedAtIso, origin });
}

function describeAttachments(attachments) {
  if (!attachments?.length) return "";
  const kinds = attachments.map((a) => a.type);
  if (kinds.includes("image")) return "(the guest sent a photo)";
  if (kinds.includes("audio")) return "(the guest sent a voice message)";
  if (kinds.includes("video")) return "(the guest sent a video)";
  if (kinds.includes("location")) return "(the guest shared their location)";
  if (kinds.includes("file")) return "(the guest sent a file)";
  return "(the guest sent an attachment)";
}

/**
 * Kick off the reply in the background function (15 minute budget, so the bot can
 * pause naturally before answering). If background functions are unavailable on
 * this Netlify plan, fall back to answering inline.
 */
async function triggerReply(payload) {
  const url = `${payload.origin}/.netlify/functions/messenger-reply-background`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-secret": internalSecret() },
      body: JSON.stringify({ psid: payload.psid, receivedAtIso: payload.receivedAtIso }),
    });
    if (res.status === 202 || res.ok) return;
    console.warn("background function returned", res.status, "— answering inline");
  } catch (e) {
    console.warn("background function unreachable —", e.message, "— answering inline");
  }
  await handleTurn({ psid: payload.psid, receivedAtIso: payload.receivedAtIso, inline: true });
}

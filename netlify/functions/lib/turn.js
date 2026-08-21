import { cfg } from "./config.js";
import * as fb from "./fb.js";
import * as store from "./store.js";
import { generateReply } from "./brain.js";
import { handoverLines } from "./handover.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SELF_HANDOFF_PAUSE_HOURS = parseFloat(process.env.BOT_SELF_HANDOFF_PAUSE_HOURS || "1");

function typingDelay(text) {
  const ms = text.length * cfg.msPerChar;
  return Math.min(cfg.maxTypingMs, Math.max(cfg.minTypingMs, ms));
}

/**
 * Answer one guest turn.
 *
 * `receivedAtIso` is the timestamp of the guest message that triggered this run.
 * We wait a few seconds first: guests almost always send two or three short
 * messages in a row ("hi" / "room ache?" / "kalke"). If a newer message arrives
 * while we wait, this run quietly exits and the newer one answers everything at
 * once — which is exactly what a person at the desk would do.
 */
export async function handleTurn({ psid, receivedAtIso, inline = false }) {
  // Running inline (no background function) means Netlify's 10s request budget
  // applies, so the human-feeling pauses have to be trimmed.
  const debounceMs = inline ? Math.min(cfg.debounceMs, 1500) : cfg.debounceMs;
  const capTyping = (ms) => (inline ? Math.min(ms, 1800) : ms);

  const settings = await store.getSettings();
  if (settings.enabled === false) return { skipped: "bot disabled" };

  let thread = await store.getThread(psid);
  if (store.isPaused(thread)) return { skipped: "human is handling this chat" };

  await sleep(debounceMs);

  if (await store.newerGuestMessageExists(psid, receivedAtIso)) {
    return { skipped: "guest still typing" };
  }

  // Re-check: a staff member may have replied during the pause.
  thread = await store.getThread(psid);
  if (store.isPaused(thread)) return { skipped: "human replied while waiting" };

  const [history, guestCount, repliesSoFar, liveRooms] = await Promise.all([
    store.getHistory(psid, cfg.historyTurns),
    store.countGuestMessages(psid),
    store.countRecentBotMessages(psid, 24),
    store.getLiveRooms(),
  ]);

  // A guest still asking after this many replies is not going to be closed by a
  // bot — they are a serious enquiry that deserves a person. Handing over here
  // wins more bookings AND stops one conversation running up a long bill,
  // because every extra reply re-reads the whole chat.
  if (repliesSoFar >= cfg.maxRepliesPerChat) {
    return handOver(psid, thread, `${repliesSoFar} replies — conversation needs a person`);
  }

  let guestName = thread?.name || null;
  if (!guestName) {
    guestName = await fb.getProfile(psid);
    if (guestName) await store.upsertThread(psid, { name: guestName });
  }

  const reply = await generateReply({
    history,
    guestName,
    knowledge: settings.knowledge || null,
    personaNotes: settings.persona_notes || null,
    isFirstContact: guestCount <= 1,
    liveRooms,
  });

  await fb.sendAction(psid, "mark_seen").catch(() => {});

  for (let i = 0; i < reply.bubbles.length; i++) {
    const bubble = reply.bubbles[i];
    if (i > 0) await sleep(700);
    await fb.sendAction(psid, "typing_on").catch(() => {});
    await sleep(capTyping(typingDelay(bubble)));
    // Store the id Facebook returns. When this same message echoes back to the
    // webhook a second later, that id is how we know it was us and not staff.
    const sent = await fb.sendText(psid, bubble);
    await store.recordMessage({ psid, mid: sent?.message_id || null, role: "bot", text: bubble });
  }
  await fb.sendAction(psid, "typing_off").catch(() => {});

  await store.upsertThread(psid, {
    last_bot_msg_at: new Date().toISOString(),
    language: reply.language || null,
  });

  await store.saveLead(psid, reply.lead);

  if (reply.handoff) {
    await store.pauseBot(psid, SELF_HANDOFF_PAUSE_HOURS, reply.handoff_reason || "bot asked for help");
    await fb.passToInbox(psid, reply.handoff_reason);
    await notifyStaff({ psid, guestName, reason: reply.handoff_reason, lead: reply.lead });
  }

  return { sent: reply.bubbles.length, handoff: reply.handoff };
}

/** Step aside and give the guest to a human. Written by hand — costs nothing. */
async function handOver(psid, thread, reason) {
  const lines = handoverLines(thread?.language);
  await fb.sendAction(psid, "mark_seen").catch(() => {});
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) await sleep(700);
    await fb.sendAction(psid, "typing_on").catch(() => {});
    await sleep(1200);
    const sent = await fb.sendText(psid, lines[i]);
    await store.recordMessage({ psid, mid: sent?.message_id || null, role: "bot", text: lines[i] });
  }
  await fb.sendAction(psid, "typing_off").catch(() => {});
  await store.pauseBot(psid, cfg.handoffPauseHours, reason);
  await fb.passToInbox(psid, reason);
  await notifyStaff({ psid, guestName: thread?.name || null, reason, lead: null });
  return { handedOver: reason };
}

async function notifyStaff({ psid, guestName, reason, lead }) {
  if (!cfg.staffNotifyUrl) return;
  try {
    await fetch(cfg.staffNotifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "messenger_handoff",
        psid,
        guest: guestName,
        reason,
        lead,
        at: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.warn("staff notify failed:", e.message);
  }
}

/**
 * Does the slow part of the work: waits for the guest to finish typing, asks
 * Claude, then types out the reply. Netlify gives *-background functions up to
 * 15 minutes, so the natural pauses are safe here.
 *
 * Not reachable from outside — it requires the internal secret.
 */
import { handleTurn } from "./lib/turn.js";
import { internalSecret } from "./lib/secret.js";

export default async function handler(req) {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  if (req.headers.get("x-internal-secret") !== internalSecret()) {
    return new Response("forbidden", { status: 403 });
  }

  const { psid, receivedAtIso } = await req.json();
  if (!psid) return new Response("missing psid", { status: 400 });

  try {
    const result = await handleTurn({ psid, receivedAtIso });
    console.log("turn:", psid, JSON.stringify(result));
  } catch (e) {
    console.error("turn failed for", psid, e?.message || e);
  }
  return new Response("ok", { status: 200 });
}

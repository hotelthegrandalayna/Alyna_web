/**
 * The off switch. Bookmark this on your phone:
 *
 *   https://hotelthegrandalayna.com/.netlify/functions/bot-switch?key=YOUR_SECRET
 *
 * It shows whether the bot is on, with a big button to turn it off or back on.
 * Set BOT_SWITCH_KEY in Netlify to any long random string you like.
 *
 * Turning it off is instant — it applies to the very next guest message. No
 * deploy, no waiting. Conversations already handed to a human stay that way.
 */
import { cfg } from "./lib/config.js";
import { setEnabled, getSettings } from "./lib/store.js";

export default async function handler(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key") || "";
  const secret = process.env.BOT_SWITCH_KEY || "";

  if (!secret) return page("Not set up", "BOT_SWITCH_KEY is not set in Netlify.", null);
  if (key !== secret) // no-store matters: without it an edge or the browser can cache this refusal
    // against the URL, so a request made before deploy finished keeps being
    // answered "forbidden" even once the correct key works.
    return new Response("forbidden", {
      status: 403,
      headers: { "cache-control": "no-store, no-cache, must-revalidate" },
    });

  const set = url.searchParams.get("set");
  if (set === "off" || set === "on") {
    const enabled = set === "on";
    const err = await setEnabled(enabled);
    if (err) return page("Could not change it", err, null);
    return page(
      enabled ? "Coordinator is ON" : "Coordinator is OFF",
      enabled
        ? "Answering guests again, starting with the next message."
        : "Stopped. Guests will get no reply at all until you turn it back on — so watch your inbox.",
      enabled,
      key
    );
  }

  const settings = await getSettings();
  const on = settings.enabled !== false;
  return page(
    on ? "Coordinator is ON" : "Coordinator is OFF",
    on ? "Answering guest messages normally." : "Not replying to anyone right now.",
    on,
    key
  );
}

function page(title, detail, on, key) {
  const button =
    on === null
      ? ""
      : on
      ? `<a class="btn off" href="?key=${encodeURIComponent(key)}&set=off">Turn Coordinator OFF</a>`
      : `<a class="btn on" href="?key=${encodeURIComponent(key)}&set=on">Turn Coordinator back ON</a>`;

  return new Response(
    `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#0f0e0c;color:#f5f0e8;font:16px/1.6 system-ui,sans-serif;padding:24px}
  .card{max-width:380px;width:100%;text-align:center}
  .dot{width:14px;height:14px;border-radius:50%;display:inline-block;margin-right:8px;
       background:${on ? "#4caf7d" : "#c95050"}}
  h1{font-size:26px;margin:0 0 12px}
  p{color:#d4cfc4;margin:0 0 28px}
  .btn{display:block;padding:18px;border-radius:12px;text-decoration:none;font-weight:600;
       font-size:17px;border:1px solid}
  .off{background:rgba(201,80,80,.12);border-color:#c95050;color:#ff9b9b}
  .on{background:rgba(76,175,125,.12);border-color:#4caf7d;color:#8fe0b6}
</style>
<div class="card">
  <h1>${on === null ? "" : '<span class="dot"></span>'}${title}</h1>
  <p>${detail}</p>
  ${button}
</div>`,
    { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } }
  );
}

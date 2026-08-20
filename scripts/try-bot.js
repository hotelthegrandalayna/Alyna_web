/**
 * Try the Messenger bot in your terminal — no Facebook needed.
 *
 *   npm run bot:try                      -> chat with it yourself
 *   npm run bot:try -- "room ache?"      -> run a scripted conversation
 *
 * Needs ANTHROPIC_API_KEY. Put it in .env.local or set it for this command.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import { generateReply } from "../netlify/functions/lib/brain.js";

// Look for .env.local next to the project, not next to wherever you happen to be
// standing when you run this. Saves a confusing "no key found" from the wrong folder.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const name of [".env.local", ".env"]) {
  const file = path.join(projectRoot, name);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const key = process.env.ANTHROPIC_API_KEY || "";
if (!key || !key.startsWith("sk-ant-")) {
  console.error("\n  No Anthropic API key found yet.\n");
  console.error("  1. Get one at  https://console.anthropic.com  ->  API Keys");
  console.error("  2. Open the file  Alyna_web/.env.local");
  console.error("  3. Paste it after the = sign so the line reads:\n");
  console.error("       ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxx\n");
  console.error("  4. Save the file and run this again.\n");
  if (key) console.error(`  (found "${key.slice(0, 12)}..." — that doesn't look like a key)\n`);
  process.exit(1);
}

/**
 * One tiny call before we start, so a billing or key problem says so plainly
 * instead of hiding behind the bot's "something went wrong" reply.
 */
async function preflight() {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  try {
    await new Anthropic({ apiKey: key }).messages.create({
      model: process.env.BOT_MODEL || "claude-opus-5",
      max_tokens: 4,
      messages: [{ role: "user", content: "hi" }],
    });
    return true;
  } catch (err) {
    const status = err?.status;
    const msg = String(err?.message || err);
    console.error("");
    if (status === 401 || /authentication/i.test(msg)) {
      console.error("  The key was rejected.");
      console.error("  Check you copied the WHOLE key — they are about 100 characters long.");
      console.error("  If in doubt, delete it in the console and create a fresh one.\n");
    } else if (/credit balance|billing|quota|insufficient/i.test(msg)) {
      console.error("  The key works, but the account has no credit yet.");
      console.error("  Go to console.anthropic.com -> Billing and add $5.");
      console.error("  That is enough for a few hundred replies while you test.\n");
    } else if (status === 429) {
      console.error("  Rate limited — too many requests just now. Wait a minute and try again.\n");
    } else if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(msg)) {
      console.error("  Could not reach Anthropic. Check your internet connection.\n");
    } else {
      console.error(`  Could not start. The exact error was:\n\n    ${msg}\n`);
    }
    return false;
  }
}

if (!(await preflight())) process.exit(1);

/**
 * Read today's real prices from Supabase, exactly like the live bot does, so what
 * you hear here is what a guest would hear. Uses the public website key already in
 * .env.local — it only reads the same room list your website shows.
 */
async function loadLiveRooms() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anon =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon) return null;
  // Plain REST call rather than the Supabase client: the client pulls in a
  // realtime websocket that Node 20 does not have, and we only need one read.
  try {
    const res = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/accommodations?select=title,price,tags,description&order=price.asc`,
      { headers: { apikey: anon, Authorization: `Bearer ${anon}` } }
    );
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const data = await res.json();
    return data?.length ? data : null;
  } catch (e) {
    console.error(`  (could not read live prices: ${e.message})`);
    return null;
  }
}

const liveRooms = await loadLiveRooms();
if (liveRooms) {
  console.log("\n  Today's prices, live from your website:");
  for (const r of liveRooms) console.log(`    ${r.title} — ${r.price} tk`);
} else {
  console.log("\n  (no live prices — the bot will offer to confirm the rate instead)");
}

const history = [];

async function turn(guestText) {
  history.push({ role: "guest", text: guestText });
  const reply = await generateReply({
    history,
    guestName: "Rahim Uddin",
    isFirstContact: history.filter((h) => h.role === "guest").length <= 1,
    liveRooms,
  });
  for (const b of reply.bubbles) {
    console.log(`\x1b[36m  Coordinator:\x1b[0m ${b}`);
    history.push({ role: "bot", text: b });
  }
  const flags = [];
  if (reply.handoff) flags.push(`HANDOFF -> ${reply.handoff_reason}`);
  if (reply.lead) {
    const filled = Object.entries(reply.lead).filter(([, v]) => v != null && v !== "");
    if (filled.length) flags.push(`lead: ${filled.map(([k, v]) => `${k}=${v}`).join(", ")}`);
  }
  if (flags.length) console.log(`\x1b[90m        [${flags.join(" | ")}]\x1b[0m`);
  console.log();
}

const scripted = process.argv.slice(2);

if (scripted.length) {
  for (const msg of scripted) {
    console.log(`\x1b[33m Guest:\x1b[0m ${msg}`);
    await turn(msg);
  }
  process.exit(0);
}

console.log("\n  Type as a guest. Ctrl+C to quit.\n");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "\x1b[33m Guest:\x1b[0m " });
rl.prompt();
rl.on("line", async (line) => {
  if (line.trim()) {
    console.log();
    await turn(line.trim());
  }
  rl.prompt();
});

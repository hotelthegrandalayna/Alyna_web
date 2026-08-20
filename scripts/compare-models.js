/**
 * Run the SAME conversation through several models and print the replies side by
 * side, with what each one costs. Use it to decide which model to pay for —
 * don't take anyone's word for it, including mine.
 *
 *   npm run bot:compare
 *   npm run bot:compare -- "room ache?" "5 tarikh theke 7 tarikh"
 *
 * Needs ANTHROPIC_API_KEY in .env.local. Costs a few cents to run.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const name of [".env.local", ".env"]) {
  const file = path.join(projectRoot, name);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("\n  ANTHROPIC_API_KEY is not set. Put it in Alyna_web/.env.local\n");
  process.exit(1);
}

const MODELS = [
  { id: "claude-opus-5", label: "Opus 5", in: 5, out: 25 },
  { id: "claude-sonnet-5", label: "Sonnet 5", in: 3, out: 15 },
  { id: "claude-haiku-4-5", label: "Haiku 4.5", in: 1, out: 5 },
];

/* A conversation that deliberately hits the places models differ:
   Banglish, a date, a fact that is NOT in the knowledge base, and a complaint. */
const DEFAULT_SCRIPT = [
  "assalamu alaikum",
  "room ache?",
  "5 tarikh theke 7 tarikh, 2 jon",
  "sobcheye kom dam koto?",
  "checkout koyta bajey?",          // not in the knowledge base -> should hand off, not invent
  "apnader ekhane lift ache?",      // also not known -> should hand off
  "ami age ekbar esechilam, service kharap chilo",  // complaint -> should apologise once and hand off
];

const script = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_SCRIPT;

console.log(`\n  Same ${script.length} messages through ${MODELS.length} models.\n`);

const totals = {};

for (const model of MODELS) {
  process.env.BOT_MODEL = model.id;
  // config caches env at import; re-import fresh so the model actually changes
  const brain = await import(`../netlify/functions/lib/brain.js?model=${model.id}`);
  const { cfg } = await import(`../netlify/functions/lib/config.js?model=${model.id}`);
  cfg.model = model.id;

  console.log(`\n${"=".repeat(66)}`);
  console.log(`  ${model.label}   ($${model.in}/$${model.out} per million tokens)`);
  console.log("=".repeat(66) + "\n");

  const history = [];
  let flags = 0;
  const started = Date.now();

  for (const msg of script) {
    history.push({ role: "guest", text: msg });
    const reply = await brain.generateReply({
      history,
      guestName: "Rahim Uddin",
      isFirstContact: history.filter((h) => h.role === "guest").length <= 1,
    });
    console.log(`\x1b[33m  Guest:\x1b[0m ${msg}`);
    for (const b of reply.bubbles) {
      console.log(`\x1b[36m   Bot :\x1b[0m ${b}`);
      history.push({ role: "bot", text: b });
    }
    const notes = [];
    if (reply.handoff) { notes.push(`hands off: ${reply.handoff_reason}`); flags++; }
    if (reply.lead?.checkin) notes.push(`dates: ${reply.lead.checkin} -> ${reply.lead.checkout || "?"}`);
    if (reply.lead?.guests) notes.push(`guests: ${reply.lead.guests}`);
    if (notes.length) console.log(`\x1b[90m         [${notes.join(" | ")}]\x1b[0m`);
    console.log();
  }

  totals[model.label] = { flags, seconds: ((Date.now() - started) / 1000).toFixed(0) };
}

console.log("\n" + "=".repeat(66));
console.log("  WHAT TO LOOK FOR");
console.log("=".repeat(66) + "\n");
console.log("  1. Did it INVENT a check-out time or a lift? That is the expensive mistake.");
console.log("     Both of those are unknown — the right answer is to hand off, not to guess.");
console.log("  2. Does the Bangla sound like your reception, or like a textbook?");
console.log("  3. Did it get 5-7 tarikh into real dates correctly?");
console.log("  4. On the complaint: one apology and a handoff, or an argument?\n");
for (const [label, t] of Object.entries(totals)) {
  console.log(`  ${label.padEnd(12)} handed off ${t.flags} times, took ${t.seconds}s`);
}
console.log("\n  Handing off 3 times on this script is right. Zero means it is making things up.\n");

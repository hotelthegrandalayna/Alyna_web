/**
 * Checks the setup and prints a report that is SAFE TO SHARE.
 * It never prints a whole key — only the first few characters and the length.
 *
 *   npm run bot:doctor
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const line = (s = "") => console.log(s);
const ok = (m) => line(`  [ ok ]  ${m}`);
const bad = (m) => line(`  [FAIL]  ${m}`);
const warn = (m) => line(`  [ -- ]  ${m}`);

line("\n  Messenger bot — setup check\n");

/* ---------- files ---------- */
for (const f of ["package.json", "netlify/functions/messenger.js", "netlify/functions/lib/knowledge.js"]) {
  fs.existsSync(path.join(root, f)) ? ok(`found ${f}`) : bad(`MISSING ${f}`);
}

/* ---------- read .env.local ---------- */
const env = {};
const envPath = path.join(root, ".env.local");
if (!fs.existsSync(envPath)) {
  bad(".env.local does not exist");
} else {
  ok(".env.local exists");
  for (const l of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = /^[ \t]*([A-Z0-9_]+)[ \t]*=[ \t]*(.*?)[ \t]*$/.exec(l);
    if (m) env[m[1]] = m[2];
  }
}

const value = (name) => env[name] ?? process.env[name] ?? "";
const peek = (v) => `${v.slice(0, 12)}…  ${v.length} chars`;

/** Report on one secret without ever printing it in full. */
function checkSecret(name, looksRight, hint, required = true) {
  const v = value(name);
  if (!v) return required ? bad(`${name} — not set`) : warn(`${name} — not set yet`);
  if (!looksRight(v)) return bad(`${name} — ${hint}  (starts "${v.slice(0, 12)}…", ${v.length} chars)`);
  ok(`${name} — ${peek(v)}`);
}

line();
checkSecret("ANTHROPIC_API_KEY", (v) => v.startsWith("sk-ant-") && v.length > 90,
            "should start sk-ant- and be about 100 characters");
checkSecret("SUPABASE_URL", (v) => v.startsWith("https://") && v.includes(".supabase.co"),
            "should be your https://xxxx.supabase.co address");
checkSecret("SUPABASE_SERVICE_ROLE_KEY", (v) => v.startsWith("sb_secret_") || v.startsWith("eyJ"),
            "should start sb_secret_ (or eyJ for a legacy key) — not the URL, not the publishable key");
checkSecret("FB_VERIFY_TOKEN", (v) => v.length >= 16, "should be a long random string");
checkSecret("BOT_SWITCH_KEY", (v) => v.length >= 16, "should be a long random string");

// The publishable key is public and belongs in the website; the secret one must differ.
if (value("SUPABASE_SERVICE_ROLE_KEY") &&
    value("SUPABASE_SERVICE_ROLE_KEY") === value("VITE_SUPABASE_PUBLISHABLE_KEY")) {
  bad("the secret key and the public key are the same — the wrong one was copied");
}

/* ---------- can it actually talk to Claude? ---------- */
const key = value("ANTHROPIC_API_KEY");
if (key.startsWith("sk-ant-")) {
  const model = process.env.BOT_MODEL || "claude-opus-5";
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    await new Anthropic({ apiKey: key }).messages.create({
      model, max_tokens: 4, messages: [{ role: "user", content: "hi" }],
    });
    ok(`Claude answered — ${model} is working, you have credit`);
  } catch (err) {
    const msg = String(err?.message || err);
    if (err?.status === 401) bad("Claude rejected the key — make a fresh one in the console");
    else if (/credit balance|billing|quota|insufficient/i.test(msg)) bad("key is valid but the account has NO CREDIT — add $5 at console.anthropic.com");
    else if (err?.status === 429) warn("rate limited right now — try again in a minute");
    else bad(`could not reach Claude: ${msg.slice(0, 120)}`);
  }
}

/* ---------- can it reach the database? ---------- */
const url = value("SUPABASE_URL");
const secret = value("SUPABASE_SERVICE_ROLE_KEY");
if (url && secret) {
  for (const table of ["fb_threads", "fb_messages", "fb_leads", "bot_settings"]) {
    try {
      const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?select=*&limit=1`, {
        headers: { apikey: secret, Authorization: `Bearer ${secret}` },
      });
      if (res.ok) ok(`database table "${table}" is reachable`);
      else bad(`table "${table}" — ${res.status} ${(await res.text()).slice(0, 90)}`);
    } catch (e) {
      bad(`table "${table}" — ${e.message}`);
    }
  }
}

/* ---------- needed only once it goes live ---------- */
line();
line("  Needed for the live Facebook Page (Meta step, not done yet):");
for (const v of ["FB_PAGE_ACCESS_TOKEN", "FB_APP_SECRET", "FB_APP_ID"]) {
  value(v) ? ok(`${v} is set`) : warn(`${v} not set yet`);
}

/* ---------- how much the bot knows ---------- */
const kb = fs.readFileSync(path.join(root, "netlify/functions/lib/knowledge.js"), "utf8");
const gaps = (kb.match(/\[TODO\]/g) || []).length;
line();
line(`  Knowledge base: ${gaps} question${gaps === 1 ? "" : "s"} still unanswered.`);
line("  (Each one makes the bot hand off to a human instead of answering.)\n");

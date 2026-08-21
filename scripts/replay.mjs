/**
 * Replay the reply path for one real conversation, from this machine.
 * Used to find out whether a missing reply is a Netlify problem or a bot problem.
 *   node scripts/replay.mjs <psid>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const l of fs.readFileSync(path.join(root, ".env.local"), "utf8").split(/\r?\n/)) {
  const m = /^[ \t]*([A-Z0-9_]+)[ \t]*=[ \t]*(.*?)[ \t]*$/.exec(l);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const psid = process.argv[2];
if (!psid) { console.error("usage: node scripts/replay.mjs <psid>"); process.exit(1); }

console.log("\n  Running the exact path the live function runs...\n");
const t0 = Date.now();
const { handleTurn } = await import("../netlify/functions/lib/turn.js");
try {
  const result = await handleTurn({ psid, receivedAtIso: new Date(Date.now() - 120000).toISOString() });
  console.log("  result:", JSON.stringify(result));
} catch (e) {
  console.log("  THREW:", e?.message || e);
  console.log((e?.stack || "").split("\n").slice(1, 6).join("\n"));
}
console.log(`\n  took ${((Date.now() - t0) / 1000).toFixed(1)}s   (Netlify's normal limit is 10s)`);

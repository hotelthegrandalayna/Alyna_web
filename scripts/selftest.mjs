/** Offline self-test: stubs the network so we can check the wiring without an API key. */
process.env.ANTHROPIC_API_KEY = "sk-ant-test";
process.env.FB_VERIFY_TOKEN = "verify-me";
process.env.FB_APP_SECRET = "app-secret";

let lastRequest = null;
let scenario = "booking";
const realFetch = globalThis.fetch;

const apiReply = (payload) =>
  new Response(
    JSON.stringify({
      id: "m", type: "message", role: "assistant", model: "claude-opus-5",
      stop_reason: "end_turn", stop_details: null,
      usage: { input_tokens: 10, output_tokens: 10 },
      content: [{ type: "text", text: JSON.stringify(payload) }],
    }),
    { status: 200, headers: { "content-type": "application/json" } }
  );

globalThis.fetch = async (url, init) => {
  if (!String(url).includes("api.anthropic.com")) return realFetch(url, init);
  lastRequest = JSON.parse(init.body);

  if (scenario === "boom") throw new Error("network down");

  if (scenario === "no-lead")
    return apiReply({
      bubbles: ["আমরা সীতাকুণ্ডে, শিবপুর পল্লী বিদ্যুৎ রোডে।"],
      language: "bangla", handoff: false, handoff_reason: "", booking_enquiry: false,
      lead: { name: "", phone: "", checkin: "", checkout: "", guests: "", room_pref: "", notes: "" },
    });

  return apiReply({
    bubbles: ["জি, ৫ তারিখ থেকে ৭ তারিখ ২ রাত।", "কয়জন থাকবেন?"],
    language: "bangla", handoff: false, handoff_reason: "", booking_enquiry: true,
    lead: {
      name: "", phone: "01711223344", checkin: "2026-09-05",
      checkout: "2026-09-07", guests: "", room_pref: "cheapest", notes: "",
    },
  });
};

const { generateReply } = await import("../netlify/functions/lib/brain.js");
const { verifySignature } = await import("../netlify/functions/lib/fb.js");
const { handoverLines } = await import("../netlify/functions/lib/handover.js");
const { hasForeignScript } = await import("../netlify/functions/lib/brain.js");
const { cfg } = await import("../netlify/functions/lib/config.js");
const { HOTEL_KNOWLEDGE } = await import("../netlify/functions/lib/knowledge.js");
const crypto = await import("node:crypto");

let pass = 0, fail = 0;
const check = (name, cond, extra) => {
  if (cond) { console.log(`  ok   ${name}`); pass++; }
  else { console.log(`  FAIL ${name}${extra ? "  -> " + extra : ""}`); fail++; }
};

/* ------------------------------------------------------------------ */
console.log("\n1. generateReply\n");

const reply = await generateReply({
  history: [
    { role: "guest", text: "assalamu alaikum" },
    { role: "guest", text: "room ache?" },
    { role: "bot", text: "জি আছে, কোন তারিখে?" },
    { role: "guest", text: "5 tarikh theke 7 tarikh, sobcheye kom dam er ta" },
    { role: "guest", text: "amar number 01711223344" },
  ],
  guestName: "Rahim Uddin",
  isFirstContact: false,
});

check("returns bubbles", Array.isArray(reply.bubbles) && reply.bubbles.length === 2);
check("lead survives when booking_enquiry is true", reply.lead !== null);
check("empty strings become null", reply.lead.name === null && reply.lead.guests === null,
      JSON.stringify(reply.lead));
check("dates kept as dates", reply.lead.checkin === "2026-09-05" && reply.lead.checkout === "2026-09-07");
check("phone captured", reply.lead.phone === "01711223344");

/* ------------------------------------------------------------------ */
console.log("\n2. what we send to Claude\n");

check("model is opus 5", lastRequest.model === "claude-opus-5", lastRequest.model);
check("effort is set", lastRequest.output_config?.effort === "low");
check("json schema attached", lastRequest.output_config?.format?.type === "json_schema");
check("system prompt is cached", lastRequest.system?.[0]?.cache_control?.type === "ephemeral");
check("knowledge base is in the system prompt", lastRequest.system[0].text.includes("Sitakund"));
check("no budget_tokens (removed on Opus 5)",
      !("thinking" in lastRequest) || !lastRequest.thinking?.budget_tokens);

const roles = lastRequest.messages.map((m) => m.role);
check("consecutive guest messages merged", roles.join(",") === "user,assistant,user",
      roles.join(",") + " (must alternate)");
check("three separate guest texts kept in one turn",
      lastRequest.messages[2].content.includes("5 tarikh") &&
      lastRequest.messages[2].content.includes("01711223344"));
check("time + name context is last, outside the cached prefix",
      lastRequest.messages.at(-1).content.includes("Rahim Uddin"));

/* ------------------------------------------------------------------ */
console.log("\n3. no stale prices baked into the knowledge file\n");

// Prices move with the season. A number typed into the file WILL go out of date
// and the bot would quote it forever. This guards against that mistake coming back.
// Only NIGHTLY ROOM RATES are banned from the file. The advance amount and the
// 20% rule are policy, not seasonal pricing, and belong here.
const NIGHTLY_RATE = /\d{1,2}[,.]?\d{3}\s*(tk|taka|৳)\s*(per night|\/night|a night)/i;
check("knowledge file carries no nightly room rate", !NIGHTLY_RATE.test(HOTEL_KNOWLEDGE),
      "someone typed a room rate back into knowledge.js — it will go stale");
check("the guard itself works", NIGHTLY_RATE.test("AC room 3,000 tk per night"));

/* ------------------------------------------------------------------ */
console.log("\n4. today's prices, read live from the website\n");

scenario = "no-lead";
await generateReply({
  history: [{ role: "guest", text: "AC room koto?" }],
  isFirstContact: true,
  liveRooms: [
    { title: "The Explorer Dune", price: 2500, tags: ["Non-Ac", "max-4people"] },
    { title: "The Grand Prestige", price: 3000, tags: ["Air-conditioned"] },
  ],
});

const ctx = lastRequest.messages.at(-1).content;
check("today's prices ride along with the message", ctx.includes("The Grand Prestige"));
check("the real number is there", ctx.includes("3,000 tk per night"));
check("room tags come through", ctx.includes("Air-conditioned"));
check("bot told to use these and nothing else", ctx.includes("quote these and nothing else"));
// The room NAMES belong in the cached prompt — they never change. The PRICES
// must not be there, or a seasonal change would be served from a stale cache.
check("room names are in the cached prompt", lastRequest.system[0].text.includes("The Grand Prestige"));
check("but their prices are not, since those change",
      !lastRequest.system[0].text.includes("3,000 tk per night"));

await generateReply({
  history: [{ role: "guest", text: "koto taka?" }],
  isFirstContact: true,
  liveRooms: null,
});
check("no price block at all when the website is unreachable",
      !lastRequest.messages.at(-1).content.includes("TODAY'S PRICES"));

/* ------------------------------------------------------------------ */
console.log("\n5. failure falls back safely\n");

scenario = "boom";
const r3 = await generateReply({ history: [{ role: "guest", text: "hi" }], isFirstContact: true });
check("still sends something", r3.bubbles.length === 1);
check("and asks for a human", r3.handoff === true);

/* ------------------------------------------------------------------ */
console.log("\n6. webhook signature\n");

const body = JSON.stringify({ object: "page", entry: [] });
const sig = "sha256=" + crypto.createHmac("sha256", "app-secret").update(body, "utf8").digest("hex");
check("good signature accepted", verifySignature(body, sig));
check("tampered body rejected", !verifySignature(body + " ", sig));
check("missing header rejected", !verifySignature(body, null));

/* ------------------------------------------------------------------ */
console.log("\n7. handing a long conversation to a person\n");

const requestsBefore = lastRequest;
const bn = handoverLines("bangla");

check("cuts over after 10 replies by default", cfg.maxRepliesPerChat === 10, String(cfg.maxRepliesPerChat));
check("bangla guest gets bangla handover", bn[0].includes("রিসেপশন"));
check("banglish guest gets banglish", handoverLines("banglish")[0].includes("reception e"));
check("english guest gets english", handoverLines("english")[0].includes("reception"));
check("unknown language falls back to bangla", handoverLines(undefined)[0].includes("রিসেপশন"));
check("mixed language falls back to bangla", handoverLines("mixed")[0].includes("রিসেপশন"));
check("handover offers the phone number", bn.join(" ").includes("+8801883352526"));
check("handover costs no api call", lastRequest === requestsBefore);

/* ------------------------------------------------------------------ */
console.log("\n8. stray-character guard\n");

// A Chinese character once turned up mid-word in a Bangla reply, which reads to a
// guest like the page was hacked. The danda cases below matter most: "।" is the
// ordinary Bangla full stop, but Unicode files it under Devanagari — so a careless
// range rejects almost every Bangla sentence and doubles the cost of every reply.
check("catches a CJK character mid-word", hasForeignScript(["ek room e男 ar mohila"]));
check("catches real Devanagari", hasForeignScript(["नमस्ते"]));
check("ALLOWS bangla ending in a danda", !hasForeignScript(["আমরা সীতাকুণ্ডে রোডে।"]));
check("ALLOWS a danda mid-sentence", !hasForeignScript(["জি আছে। কোন তারিখে?"]));
check("ALLOWS bangla digits", !hasForeignScript(["ভাড়া ৩,০০০ টাকা।"]));
check("ALLOWS plain banglish", !hasForeignScript(["AC room 3,000 tk theke"]));

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);

export const cfg = {
  // Facebook
  verifyToken: process.env.FB_VERIFY_TOKEN,
  pageToken: process.env.FB_PAGE_ACCESS_TOKEN,
  appSecret: process.env.FB_APP_SECRET,
  appId: process.env.FB_APP_ID || "",
  graphVersion: process.env.FB_GRAPH_VERSION || "v21.0",

  // Anthropic
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.BOT_MODEL || "claude-opus-5",
  effort: process.env.BOT_EFFORT || "low",

  // Supabase (service role — server side only, never expose to the browser)
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Behaviour knobs
  debounceMs: intEnv("BOT_DEBOUNCE_MS", 4000),      // wait this long for the guest to finish typing
  minTypingMs: intEnv("BOT_MIN_TYPING_MS", 1400),   // shortest "typing..." pause
  maxTypingMs: intEnv("BOT_MAX_TYPING_MS", 5500),   // longest "typing..." pause
  msPerChar: intEnv("BOT_MS_PER_CHAR", 28),         // typing speed simulation
  handoffPauseHours: intEnv("BOT_HANDOFF_PAUSE_HOURS", 8), // bot stays quiet after a human replies
  historyTurns: intEnv("BOT_HISTORY_TURNS", 24),    // how much of the chat the bot remembers
  maxRepliesPerChat: intEnv("BOT_MAX_REPLIES_PER_CHAT", 10), // then hand the guest to a person
  passToInbox: process.env.BOT_PASS_TO_INBOX === "true",
  staffNotifyUrl: process.env.BOT_STAFF_NOTIFY_URL || "",

  siteUrl: process.env.URL || "",
};

function intEnv(name, fallback) {
  const v = parseInt(process.env[name] || "", 10);
  return Number.isFinite(v) ? v : fallback;
}

export function missingConfig() {
  const need = ["verifyToken", "pageToken", "anthropicKey", "supabaseUrl", "supabaseServiceKey"];
  return need.filter((k) => !cfg[k]);
}

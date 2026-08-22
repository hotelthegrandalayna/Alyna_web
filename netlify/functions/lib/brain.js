import Anthropic from "@anthropic-ai/sdk";
import { cfg } from "./config.js";
import { buildSystemPrompt, buildTurnContext } from "./persona.js";
import { HOTEL_KNOWLEDGE } from "./knowledge.js";

let _client = null;
function client() {
  if (!_client) _client = new Anthropic({ apiKey: cfg.anthropicKey });
  return _client;
}

const REPLY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["bubbles", "language", "handoff", "handoff_reason", "booking_enquiry", "lead"],
  properties: {
    bubbles: {
      // No minItems/maxItems here — the API rejects them in a structured-output
      // schema. The 1-to-3 limit is enforced in code after the reply comes back.
      type: "array",
      items: { type: "string" },
      description:
        "One to three messages to send, in order. Short, like real Messenger texts. Usually one.",
    },
    language: {
      type: "string",
      enum: ["bangla", "banglish", "english", "mixed"],
      description: "The language you replied in, mirroring the guest.",
    },
    handoff: {
      type: "boolean",
      description:
        "True if a human from reception must take over: the booking is ready to confirm, the guest asked something you do not know, the guest is upset, the guest asked for a person, or the guest wants a discount or special arrangement.",
    },
    handoff_reason: {
      type: "string",
      description: "Short reason in English for the staff. Empty string if handoff is false.",
    },
    booking_enquiry: {
      type: "boolean",
      description: "True if this guest is enquiring about staying at the hotel.",
    },
    lead: {
      type: "object",
      additionalProperties: false,
      required: ["name", "phone", "checkin", "checkout", "guests", "room_pref", "notes"],
      description:
        "Booking details gathered SO FAR in this conversation. Use an empty string for anything not yet known - never guess or invent a placeholder.",
      properties: {
        name: { type: "string", description: "Guest's name, or empty string." },
        phone: { type: "string", description: "Phone number, or empty string." },
        checkin: { type: "string", description: "Check-in date as YYYY-MM-DD, or empty string." },
        checkout: { type: "string", description: "Check-out date as YYYY-MM-DD, or empty string." },
        guests: { type: "string", description: "Number of guests as digits, or empty string." },
        room_pref: { type: "string", description: "Room or room type they want, or empty string." },
        notes: { type: "string", description: "Anything else reception should know, in English. Empty string if nothing." },
      },
    },
  },
};

const FALLBACK = {
  bubbles: ["একটু সমস্যা হচ্ছে, রিসেপশন থেকে একজন এখনই আপনাকে মেসেজ করবে।"],
  language: "bangla",
  handoff: true,
  handoff_reason: "bot error",
  booking_enquiry: false,
  lead: null,
};

export async function generateReply({ history, guestName, knowledge, personaNotes, isFirstContact, liveRooms }) {
  const kb = knowledge || HOTEL_KNOWLEDGE;

  const nowDhaka = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date());

  const messages = history
    .filter((m) => (m.text || "").trim())
    .map((m) => ({
      role: m.role === "guest" ? "user" : "assistant",
      content: m.role === "staff" ? `(reception replied by hand): ${m.text}` : m.text,
    }));

  // Volatile context goes last so the cached system prefix stays byte-identical.
  // Prices live here rather than in the knowledge file precisely because they move.
  // Whether it is night in Bangladesh decides whether the assistant may tell a
  // guest to ring the hotel. Computed here rather than left for the model to
  // infer from a formatted time string, because getting it wrong means waking
  // the owner or promising a call nobody will make.
  const dhakaHour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", hour12: false }).format(new Date())
  );
  const isLateNight = dhakaHour >= 22 || dhakaHour < 8;

  const turnCtx = buildTurnContext({ guestName, nowDhaka, isFirstContact, isLateNight });
  const priceCtx = formatLiveRooms(liveRooms);
  messages.push({
    role: "user",
    content: `(context for you, not from the guest: ${turnCtx})${priceCtx}`,
  });

  // Collapse consecutive same-role turns into one. Guests routinely fire off three
  // messages in a row, and the reply should answer all of them together.
  const merged = [];
  for (const m of messages) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) last.content += `\n${m.content}`;
    else merged.push({ ...m });
  }
  if (merged[0].role !== "user") {
    merged.unshift({ role: "user", content: "(guest opened the chat)" });
  }

  const system = [
    {
      type: "text",
      text: buildSystemPrompt(kb, personaNotes || ""),
      // One hour, not the default five minutes. Everything the bot knows —
      // around 7,000 tokens — is re-sent with every single reply, so a cache
      // miss is the largest single cost in the whole system. Guests answer
      // slowly: they read, think, ask their husband, come back twenty minutes
      // later. At five minutes almost every reply paid full price.
      cache_control: { type: "ephemeral", ttl: "1h" },
    },
  ];

  async function ask(messages) {
    const res = await client().messages.create({
      model: cfg.model,
      max_tokens: 4000,
      system,
      output_config: {
        effort: cfg.effort,
        format: { type: "json_schema", schema: REPLY_SCHEMA },
      },
      messages,
    });

    if (res.stop_reason === "refusal") {
      console.warn("refusal:", res.stop_details);
      return null;
    }

    const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const parsed = JSON.parse(text);
    parsed.bubbles = (parsed.bubbles || [])
      .map((b) => String(b).trim())
      .filter(Boolean)
      .slice(0, 3);
    return parsed.bubbles.length ? parsed : null;
  }

  try {
    let parsed = await ask(merged);
    if (!parsed) return { ...FALLBACK, handoff_reason: "empty or refused reply" };

    // Very occasionally a stray character from another writing system lands in the
    // middle of a Bangla word. A guest reads that as a hacked page, so throw the
    // reply away and ask once more rather than send it.
    if (hasForeignScript(parsed.bubbles)) {
      console.warn("foreign script in reply, retrying:", parsed.bubbles.join(" | "));
      // Append the nudge to the last turn rather than adding another user message,
      // so the conversation still alternates the way the first attempt did.
      const nudged = merged.map((m, i) =>
        i === merged.length - 1
          ? {
              ...m,
              content:
                m.content +
                "\n(your last reply contained a character from another writing system. Write again using ONLY Bangla script and English letters — nothing else.)",
            }
          : m
      );
      const retry = await ask(nudged);
      if (retry && !hasForeignScript(retry.bubbles)) parsed = retry;
      else if (retry) parsed = { ...retry, bubbles: retry.bubbles.map(stripForeignScript) };
      else parsed = { ...parsed, bubbles: parsed.bubbles.map(stripForeignScript) };
    }

    parsed.lead = normaliseLead(parsed);
    return parsed;
  } catch (err) {
    console.error("generateReply failed:", err?.message || err);
    return FALLBACK;
  }
}

/**
 * Scripts that could never legitimately appear in a reply to a Sitakunda guest:
 * Japanese, Chinese, Korean, Devanagari letters, Thai, Cyrillic.
 *
 * Careful with the Devanagari block: U+0964 "।" is the danda, the ordinary Bangla
 * full stop, and U+0965 its double. Those are normal Bangla punctuation and must
 * stay allowed — the range deliberately steps around them.
 */
const FOREIGN_SCRIPT =
  /[぀-ヿ一-鿿가-힯ऀ-ॣ०-ॿ฀-๿Ѐ-ӿ]/g;

export function hasForeignScript(bubbles) {
  return bubbles.some((b) => {
    FOREIGN_SCRIPT.lastIndex = 0;
    return FOREIGN_SCRIPT.test(b);
  });
}

/** Last resort if a retry also comes back wrong — drop the stray characters. */
function stripForeignScript(text) {
  return text.replace(FOREIGN_SCRIPT, "").replace(/\s{2,}/g, " ").trim();
}

/** Empty strings mean "not known yet" - collapse the whole lead to null when nothing is known. */
function normaliseLead(parsed) {
  if (!parsed.booking_enquiry || !parsed.lead) return null;
  const raw = parsed.lead;
  const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const guests = parseInt(str(raw.guests) || "", 10);
  const lead = {
    name: str(raw.name),
    phone: str(raw.phone),
    checkin: isDate(str(raw.checkin)) ? str(raw.checkin) : null,
    checkout: isDate(str(raw.checkout)) ? str(raw.checkout) : null,
    guests: Number.isFinite(guests) ? guests : null,
    room_pref: str(raw.room_pref),
    notes: str(raw.notes),
  };
  return Object.values(lead).some((v) => v != null) ? lead : null;
}

function isDate(v) {
  return !!v && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
}

/**
 * Today's prices, pulled live from the website's own room table.
 * The owner raises prices when the hotel is busy — so whatever is on the website
 * right now is the truth, and the bot must never quote a number from memory.
 */
function formatLiveRooms(rooms) {
  if (!rooms?.length) return "";
  const lines = rooms.map((r) => {
    const tags = Array.isArray(r.tags) && r.tags.length ? `  [${r.tags.join(", ")}]` : "";
    const price = r.price != null ? `${Number(r.price).toLocaleString("en-US")} tk per night` : "price not set";
    return `  ${r.title} — ${price}${tags}`;
  });
  return `

TODAY'S PRICES, read live from the website a moment ago. These are the real
prices right now — quote these and nothing else. They change with the season, so
never use a price you remember from earlier in the conversation or from anywhere else:
${lines.join("\n")}`;
}

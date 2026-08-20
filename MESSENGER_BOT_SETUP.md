# Messenger AI agent — Hotel The Grand Alayna

A front-desk assistant called **Coordinator** that answers your Facebook Page messages
like a person, not like a chatbot menu.

---

## What it actually does

**It sounds human.** It replies in whatever the guest used — Bangla script,
Banglish, or English. Short messages, one or two lines, no bullet points, no
"Dear valued guest". It marks the message seen, shows *typing…* for a realistic
few seconds, then answers.

**It waits like a person waits.** Guests send three messages in a row
("assalamu alaikum" / "room ache?" / "kalke"). The bot pauses ~4 seconds, sees
all three, and answers them together in one reply — instead of firing off three
separate answers.

**It never makes things up.** Every fact it can say lives in
`netlify/functions/lib/knowledge.js`. If a guest asks something that isn't in
that file, it does not guess — it says it's confirming and calls a human.

**It never confirms a booking.** It quotes rates, works out totals, collects
name / dates / guests / phone, and gives the bKash number. Then it stops. You or
your staff confirm the actual booking. It will never tell a guest a room is free
on a date.

**It answers one step ahead.** Not by writing longer messages — by answering the
question underneath the question. Asked "koto taka?", it gives the rate *and*
says whether the room is AC, because that is always what gets asked next. Fewer
round trips, and it reads as someone who knows the job.

**It knows when to stop and call you.** After 10 replies in one conversation, the
bot hands the guest to a person automatically. A guest still asking after ten
answers is a serious enquiry that a bot will not close — and every extra reply
costs more than the last, because the bot re-reads the whole chat each time. So
this wins you bookings and saves you money at the same time. Change the number
with `BOT_MAX_REPLIES_PER_CHAT`.

**It gets out of the way.** The moment you reply by hand from the Page Inbox, the
bot goes silent on that conversation for 8 hours. No talking over you.

**It saves the lead.** Everything it collects lands in a `fb_leads` table in
Supabase — name, phone, dates, guests, room preference — so nothing gets lost in
the inbox.

---

## What you need before you start

| Thing | Where to get it |
|---|---|
| Anthropic API key | console.anthropic.com → API keys |
| Facebook Page access token | developers.facebook.com → your app → Messenger → Generate token |
| Facebook App ID + App Secret | Same app → Settings → Basic |
| Supabase service role key | Supabase dashboard → Project Settings → API → `service_role` |
| A made-up verify token | Any random string. You invent it. |

---

## Setup, step by step

### 1. Create the database tables

Supabase dashboard → SQL Editor → paste the contents of
`supabase_messenger_schema.sql` → Run.

That creates four tables: `fb_threads`, `fb_messages`, `fb_leads`, `bot_settings`.

### 2. Fill in what the bot knows

Open `netlify/functions/lib/knowledge.js`. Every line starting with `[TODO]` is
a question the bot currently **cannot answer** — it will hand off to a human
instead. Fill them in and it starts answering.

The important ones to do first:

- Check-in and check-out time
- Is breakfast included?
- Are all rooms AC?
- How many people per room
- Unmarried couple / ID policy at check-in (guests ask this constantly)
- Distance from Chattogram city
- Cancellation policy — is the 500 tk advance refundable?

### 3. Try it before it goes anywhere near Facebook

Create `Alyna_web/.env.local` with just one line:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then chat with it in your terminal:

```bash
npm run bot:try
```

Type as if you were a guest. Try Bangla, try Banglish, try a rude message, try
asking something you haven't filled in yet. Adjust the knowledge file and the
tone rules in `netlify/functions/lib/persona.js` until it sounds right to you.

**Do this properly before going live.** It is much cheaper to fix the tone here
than in front of real guests.

### 4. Put the keys into Netlify

Netlify → your site → Site configuration → Environment variables. Add every
variable listed in `.env.example` (the ones not commented out).

⚠️ `SUPABASE_SERVICE_ROLE_KEY` is a master key to your database. It goes only in
Netlify environment variables — never in the website code, never in a `VITE_`
variable, never committed to git.

### 5. Deploy

Push to `main`. Netlify builds the site and the two functions.

Check it's alive:

```bash
curl "https://hotelthegrandalayna.com/.netlify/functions/messenger?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=hello"
```

It should print `hello`. If it prints `forbidden`, the verify token doesn't match.

### 6. Connect the Facebook Page

developers.facebook.com → your app → **Messenger → Settings**:

1. **Access Tokens** → add your Page → generate a token → that's `FB_PAGE_ACCESS_TOKEN`.
2. **Webhooks** → Add Callback URL:
   - Callback URL: `https://hotelthegrandalayna.com/.netlify/functions/messenger`
   - Verify Token: the same random string you put in `FB_VERIFY_TOKEN`
3. Subscribe the Page to these fields: **messages**, **messaging_postbacks**,
   **message_echoes**.
   `message_echoes` is what makes the bot shut up when you reply by hand — don't skip it.
4. Submit the app for the **pages_messaging** permission. Until it's approved,
   the bot only replies to people with a role on the app (you and your admins),
   which is perfect for testing.

### 7. Test on the real Page

Message the Page from your own Facebook account. You should see: seen tick →
typing… → a short human reply.

---

## Running it day to day

**To take over a chat:** just reply from the Page Inbox. The bot stops for 8 hours.

**To turn the bot off completely:** in Supabase, set `bot_settings.enabled` to `false`.
Takes effect on the next message — no deploy needed.

**To change what it knows without a deploy:** paste your updated knowledge text
into `bot_settings.knowledge`. If that column has anything in it, it overrides
the file.

**To see your leads:**

```sql
select * from fb_leads where status = 'new' order by created_at desc;
```

**To see chats waiting on a human:**

```sql
select psid, name, handoff_reason, bot_paused_until
from fb_threads where needs_human order by updated_at desc;
```

---

## Cost

Everything here is free except the AI itself. Facebook charges nothing for Page
messaging, and Netlify and Supabase both stay inside their free tiers at this
volume. The only bill is Claude, paid as prepaid credit from console.anthropic.com.

One reply = one time the bot answers, not one whole conversation. If a guest
sends three messages in a row, the bot waits, reads all three and answers once —
that is one reply, not three.

Later replies cost more than earlier ones, because the bot re-reads the chat each
time to remember what was said. That is why the 10-reply handover matters. With
it, one guest conversation costs at most:

| | Typical guest (~5 replies) | Worst case (hits the 10 cap) | 50 guests a month |
|---|---|---|---|
| Opus 5 (default) | ~12 cents | ~22 cents | ~$6 |
| Sonnet 5 | ~4 cents | ~8 cents | ~$2 |
| Haiku 4.5 | ~1 cent | ~2 cents | under $1 |

Set `BOT_MODEL=claude-sonnet-5` in Netlify to switch. Compare them with
`npm run bot:try` first — listen to the Bangla especially, since that is where
the cheaper models slip first.

In the Anthropic console, set a monthly spend limit as well. Then the bill
cannot surprise you no matter what happens.

---

## Two things to be aware of

**Meta requires you to disclose automated experiences.** The bot is built to be
honest: if a guest asks directly whether they're talking to a bot, it says yes
plainly and keeps helping. Don't remove that rule from `persona.js` — besides
the policy, guests find out anyway and it costs you trust.

**The 24-hour rule.** A Page can only message someone freely within 24 hours of
their last message. The bot always replies immediately, so this never bites —
but it does mean the bot can't follow up two days later on its own.

---

## Files

```
netlify/functions/
  messenger.js                     the webhook Facebook calls
  messenger-reply-background.js    does the slow work (waiting, thinking, typing)
  lib/
    knowledge.js    <-- EDIT THIS. everything the bot is allowed to say
    persona.js      <-- EDIT THIS. how it talks
    brain.js            the Claude call
    turn.js             pacing, typing, the 10-reply handover
    handover.js     <-- EDIT THIS. what it says when it calls a human
    fb.js               Facebook Send API
    store.js            Supabase
    config.js           settings from environment variables
    secret.js           internal auth between the two functions

scripts/
  try-bot.js          npm run bot:try   — chat with it in the terminal
  selftest.mjs        npm run bot:test  — offline wiring test, no API key needed

supabase_messenger_schema.sql   run once in Supabase
.env.example                    the variables to set in Netlify
```

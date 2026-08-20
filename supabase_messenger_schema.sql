-- Messenger AI agent — run this once in the Supabase SQL editor.

create table if not exists fb_threads (
  psid              text primary key,
  page_id           text,
  name              text,
  language          text,
  bot_paused_until  timestamptz,
  needs_human       boolean default false,
  handoff_reason    text,
  last_user_msg_at  timestamptz,
  last_bot_msg_at   timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create table if not exists fb_messages (
  id           bigserial primary key,
  psid         text not null,
  mid          text unique,
  role         text not null check (role in ('guest','bot','staff')),
  text         text,
  attachments  jsonb,
  created_at   timestamptz default now()
);
create index if not exists fb_messages_psid_time on fb_messages (psid, created_at desc);

create table if not exists fb_leads (
  id           bigserial primary key,
  psid         text not null,
  name         text,
  phone        text,
  checkin      date,
  checkout     date,
  guests       int,
  room_pref    text,
  notes        text,
  status       text default 'new' check (status in ('new','contacted','confirmed','lost')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create index if not exists fb_leads_status on fb_leads (status, created_at desc);

-- Optional: edit the bot's knowledge live, without redeploying the website.
create table if not exists bot_settings (
  id             int primary key default 1,
  enabled        boolean default true,
  knowledge      text,
  persona_notes  text,
  updated_at     timestamptz default now()
);
insert into bot_settings (id, enabled) values (1, true) on conflict (id) do nothing;

-- Lock everything down. The webhook uses the service-role key, which bypasses RLS.
alter table fb_threads   enable row level security;
alter table fb_messages  enable row level security;
alter table fb_leads     enable row level security;
alter table bot_settings enable row level security;

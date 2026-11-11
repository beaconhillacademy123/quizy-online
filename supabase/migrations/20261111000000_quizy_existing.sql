-- Quizy schema for project snxehcpichoskvdtuveh.
-- Inspected live before writing this file. Every statement is additive:
-- existing tables are not dropped, existing rows are not updated, and a
-- policy is created only when that policy name is absent.
-- Run in the Supabase SQL editor if you are restoring an empty project.
-- On the current project these tables already exist; running this is safe.

create table if not exists public.quizy_questions (
  id text primary key,
  land_id text not null,
  age_band text not null,
  difficulty text not null,
  question text not null default '',
  options jsonb not null default '[]'::jsonb,
  answer_index integer not null default 0,
  explanation text default '',
  word text not null default '',
  hint text not null default '',
  active boolean not null default true,
  expires_at timestamptz,
  question_kind text,
  source_date date,
  sport_category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quizy_questions add column if not exists expires_at timestamptz;
alter table public.quizy_questions add column if not exists question_kind text;
alter table public.quizy_questions add column if not exists source_date date;
alter table public.quizy_questions add column if not exists sport_category text;

create table if not exists public.quizy_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_key text not null,
  display_name text not null,
  age_band text not null default 'young',
  difficulty text not null default 'easy',
  avatar text not null default '🦊',
  total_stars integer not null default 0,
  land_stars jsonb not null default '{}'::jsonb,
  land_correct jsonb not null default '{}'::jsonb,
  land_done jsonb not null default '{}'::jsonb,
  coins integer not null default 0,
  best_streak integer not null default 0,
  badges jsonb not null default '[]'::jsonb,
  unlocked jsonb not null default '[]'::jsonb,
  theme text not null default 'default',
  question_history jsonb not null default '{}'::jsonb,
  music_on boolean not null default true,
  sport_category text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, profile_key)
);

alter table public.quizy_profiles add column if not exists land_correct jsonb not null default '{}'::jsonb;
alter table public.quizy_profiles add column if not exists sport_category text not null default '';

create table if not exists public.quizy_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid references public.quizy_profiles (id) on delete set null,
  land_id text not null,
  age_band text not null,
  difficulty text not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  correct_answers integer not null default 0,
  duration_ms bigint,
  played_at timestamptz not null default now()
);

create table if not exists public.quizy_achievements (
  id text primary key,
  name text not null,
  description text not null default '',
  icon text not null default '🏆',
  coin_reward integer not null default 0,
  active boolean not null default true
);

create table if not exists public.quizy_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  active boolean not null default true,
  published_at timestamptz not null default now()
);

create table if not exists public.quizy_settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz not null default now()
);

insert into public.quizy_settings (key, value)
values
  ('maintenance_mode', 'false'::jsonb),
  ('registrations_enabled', 'true'::jsonb),
  ('feature_battle', 'true'::jsonb),
  ('feature_current_affairs', 'true'::jsonb),
  ('feature_sports', 'true'::jsonb),
  ('feature_daily_challenge', 'true'::jsonb),
  ('music_enabled', 'true'::jsonb),
  ('force_update', 'false'::jsonb),
  ('min_app_version', '"2.2.1"'::jsonb),
  ('announcement', 'null'::jsonb)
on conflict (key) do nothing;

create table if not exists public.quizy_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.quizy_installations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  install_key text not null,
  platform text not null default 'web',
  last_seen_at timestamptz not null default now(),
  unique (user_id, install_key)
);

create table if not exists public.quizy_messages (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  message text not null,
  sender_name text,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table if not exists public.quizy_user_controls (
  user_id uuid primary key references auth.users (id) on delete cascade,
  suspended boolean not null default false,
  reason text,
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_feedback (
  id bigint generated by default as identity primary key,
  comment text
);

-- Battle tables already exist on the live project and are not readable by anon.
-- CREATE IF NOT EXISTS leaves them untouched. The definitions below match the
-- columns the recoverable Edge Function in supabase/functions expects.
create table if not exists public.quizy_battle_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'lobby',
  current_round integer not null default 0,
  total_rounds integer not null default 10,
  round_resolved boolean not null default false,
  difficulty text not null default 'easy',
  age_band text not null default 'young',
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.quizy_battle_players (
  room_id uuid not null references public.quizy_battle_rooms (id) on delete cascade,
  player_id text not null,
  display_name text not null,
  avatar text not null default '🧒',
  score integer not null default 0,
  active boolean not null default true,
  is_host boolean not null default false,
  player_token text not null,
  primary key (room_id, player_id)
);

create table if not exists public.quizy_battle_answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.quizy_battle_rooms (id) on delete cascade,
  player_id text not null,
  round integer not null,
  answer_index integer not null,
  correct boolean not null default false,
  unique (room_id, player_id, round)
);

create index if not exists quizy_questions_lookup on public.quizy_questions (land_id, age_band, difficulty, active);
create index if not exists quizy_attempts_user_idx on public.quizy_attempts (user_id, played_at);
create index if not exists quizy_activity_user_idx on public.quizy_activity (user_id, created_at);
create index if not exists quizy_messages_recipient_idx on public.quizy_messages (recipient_user_id, read_at);

create or replace function public.quizy_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'quizy_profiles_touch') then
    create trigger quizy_profiles_touch
      before update on public.quizy_profiles
      for each row execute function public.quizy_touch_updated_at();
  end if;
end $$;

alter table public.quizy_questions enable row level security;
alter table public.quizy_profiles enable row level security;
alter table public.quizy_attempts enable row level security;
alter table public.quizy_achievements enable row level security;
alter table public.quizy_announcements enable row level security;
alter table public.quizy_settings enable row level security;
alter table public.quizy_activity enable row level security;
alter table public.quizy_installations enable row level security;
alter table public.quizy_messages enable row level security;
alter table public.quizy_user_controls enable row level security;
alter table public.parent_feedback enable row level security;
alter table public.quizy_battle_rooms enable row level security;
alter table public.quizy_battle_players enable row level security;
alter table public.quizy_battle_answers enable row level security;

grant select on public.quizy_questions to anon, authenticated;
grant select on public.quizy_settings to anon, authenticated;
grant select on public.quizy_achievements to anon, authenticated;
grant select on public.quizy_announcements to anon, authenticated;
grant select, insert, update on public.quizy_profiles to authenticated;
grant select, insert on public.quizy_attempts to authenticated;
grant insert on public.quizy_activity to authenticated;
grant select, insert, update on public.quizy_installations to authenticated;
grant select, update on public.quizy_messages to authenticated;
grant select on public.quizy_user_controls to authenticated;
grant select on public.parent_feedback to anon, authenticated;
grant insert on public.parent_feedback to authenticated;

-- Battle rows stay closed to the browser. The Edge Function uses the service role.
revoke all on public.quizy_battle_rooms from anon, authenticated;
revoke all on public.quizy_battle_players from anon, authenticated;
revoke all on public.quizy_battle_answers from anon, authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_questions_public_read') then
    create policy quizy_questions_public_read on public.quizy_questions for select to anon, authenticated using (active = true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_profiles_owner_all') then
    create policy quizy_profiles_owner_all on public.quizy_profiles for all to authenticated
      using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_attempts_owner_select') then
    create policy quizy_attempts_owner_select on public.quizy_attempts for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_attempts_owner_insert') then
    create policy quizy_attempts_owner_insert on public.quizy_attempts for insert to authenticated with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_achievements_public_read') then
    create policy quizy_achievements_public_read on public.quizy_achievements for select to anon, authenticated using (active = true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_announcements_public_read') then
    create policy quizy_announcements_public_read on public.quizy_announcements for select to anon, authenticated using (active = true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_settings_public_read') then
    create policy quizy_settings_public_read on public.quizy_settings for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_activity_owner_insert') then
    create policy quizy_activity_owner_insert on public.quizy_activity for insert to authenticated with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_installations_owner_all') then
    create policy quizy_installations_owner_all on public.quizy_installations for all to authenticated
      using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_messages_recipient_select') then
    create policy quizy_messages_recipient_select on public.quizy_messages for select to authenticated using (recipient_user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_messages_recipient_update') then
    create policy quizy_messages_recipient_update on public.quizy_messages for update to authenticated
      using (recipient_user_id = auth.uid()) with check (recipient_user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'quizy_user_controls_self_select') then
    create policy quizy_user_controls_self_select on public.quizy_user_controls for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'parent_feedback_read') then
    create policy parent_feedback_read on public.parent_feedback for select to anon, authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'parent_feedback_insert') then
    create policy parent_feedback_insert on public.parent_feedback for insert to authenticated with check (true);
  end if;
end $$;

-- Realtime: the browser also polls and broadcasts on battle-<room id>.
-- postgres_changes is optional and does not expose answer keys because anon
-- still has no SELECT grant on the battle tables.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'quizy_battle_players')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'quizy_battle_players'
     ) then
    alter publication supabase_realtime add table public.quizy_battle_players;
  end if;
exception when others then
  null;
end $$;

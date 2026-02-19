-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================================================
-- Tables
-- ============================================================================

-- Sessions table: represents a workshop/lab session
create table sessions (
  id uuid primary key default gen_random_uuid(),
  lab_slug text not null,
  lab_title text not null,
  alias text,
  trainer_passphrase_hash text,
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- Participants table: users who join a session
create table participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  name text not null,
  joined_at timestamptz default now(),
  unique (session_id, name)
);

-- Progress table: tracks step completion per participant
create table progress (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references participants(id) on delete cascade,
  session_id uuid not null references sessions(id) on delete cascade,
  step_id text not null,
  points integer not null default 0,
  completed_at timestamptz default now(),
  unique (participant_id, step_id)
);

-- ============================================================================
-- Indexes
-- ============================================================================

create index idx_participants_session_id on participants(session_id);
create index idx_progress_participant_id on progress(participant_id);
create index idx_progress_session_id on progress(session_id);

-- ============================================================================
-- View: Leaderboard
-- ============================================================================

create view leaderboard as
select
  p.id as participant_id,
  p.name,
  p.session_id,
  coalesce(sum(pr.points), 0) as total_points,
  count(pr.id) as steps_completed,
  max(pr.completed_at) as last_completed_at
from participants p
left join progress pr on p.id = pr.participant_id
group by p.id, p.name, p.session_id;

-- ============================================================================
-- RPC Functions
-- ============================================================================

-- Create a new session, optionally with a trainer passphrase
create or replace function create_session(
  p_lab_slug text,
  p_lab_title text,
  p_alias text default null,
  p_passphrase text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_session_id uuid;
  v_hash text;
begin
  if p_passphrase is not null then
    v_hash := crypt(p_passphrase, gen_salt('bf'));
  end if;

  insert into sessions (lab_slug, lab_title, alias, trainer_passphrase_hash)
  values (p_lab_slug, p_lab_title, p_alias, v_hash)
  returning id into v_session_id;

  return v_session_id;
end;
$$;

-- Verify a trainer passphrase against the stored hash
create or replace function verify_trainer_passphrase(
  p_session_id uuid,
  p_passphrase text
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_hash text;
begin
  select trainer_passphrase_hash into v_hash
  from sessions
  where id = p_session_id;

  if v_hash is null then
    return false;
  end if;

  return v_hash = crypt(p_passphrase, v_hash);
end;
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Enable RLS on all tables
alter table sessions enable row level security;
alter table participants enable row level security;
alter table progress enable row level security;

-- Sessions policies
create policy "sessions_select" on sessions
  for select using (true);

create policy "sessions_insert" on sessions
  for insert with check (true);

-- Participants policies
create policy "participants_select" on participants
  for select using (true);

create policy "participants_insert" on participants
  for insert with check (true);

-- Progress policies
create policy "progress_select" on progress
  for select using (true);

create policy "progress_insert" on progress
  for insert with check (true);

create policy "progress_delete" on progress
  for delete using (true);

-- ============================================================================
-- Realtime
-- ============================================================================

alter publication supabase_realtime add table progress;

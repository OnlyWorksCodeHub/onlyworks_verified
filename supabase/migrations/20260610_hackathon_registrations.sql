-- ONLYWEIRD '26 hackathon registrations.
-- Written by /api/hackathon/register using the service-role key only;
-- RLS is enabled with no policies so anon/authenticated clients have no access.

create table if not exists public.hackathon_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  ow_id text not null,
  ow_verified boolean not null default false,
  github text,
  blurb text,
  team text not null default 'solo',
  team_name text,
  attending text not null default 'maybe',
  referrer text,
  serial text not null unique
);

create unique index if not exists hackathon_registrations_email_key
  on public.hackathon_registrations (lower(email));

alter table public.hackathon_registrations enable row level security;

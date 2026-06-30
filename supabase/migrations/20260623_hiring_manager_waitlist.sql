-- Hiring-manager waitlist (the "for people who hire" side of the site).
-- Written by /api/hiring-waitlist using the service-role key only;
-- RLS is enabled with no policies so anon/authenticated clients have no access.

create table if not exists public.hiring_manager_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  job_title text,
  team_size text
);

-- One signup per email; the route relies on 23505 to report "already on the waitlist".
create unique index if not exists hiring_manager_waitlist_email_key
  on public.hiring_manager_waitlist (lower(email));

alter table public.hiring_manager_waitlist enable row level security;

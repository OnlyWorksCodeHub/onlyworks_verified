-- Discord handle for ONLYWEIRD '26 registrations — the team invites
-- registrants into the ONLYWEIRD Discord server before kickoff.
alter table public.hackathon_registrations
  add column if not exists discord text;

-- Support tickets: users submit a question/bug + image/video attachments at
-- /support/tickets; the team triages them at /admin/tickets. Rows are written by
-- /api/support-tickets and read/updated by /api/admin/tickets using the
-- service-role key only — RLS is enabled with no policies, so anon/authenticated
-- clients have no direct table access. Attachments live in the PRIVATE Storage
-- bucket created below; the team views them via short-lived signed URLs.

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  ref text not null unique,                         -- human-friendly id, e.g. TKT-7F3K2A
  name text,
  email text not null,
  category text not null default 'bug',             -- bug | install | account | question | other
  subject text not null,
  message text not null,
  status text not null default 'open',              -- open | in_progress | resolved
  priority text not null default 'normal',          -- low | normal | high
  attachments jsonb not null default '[]'::jsonb,   -- [{ path, name, type, size }]
  admin_notes text,
  user_id uuid,                                     -- supabase auth user id, if signed in
  ow_id text,                                       -- OnlyWorks id, if signed in
  app_version text,
  user_agent text
);

create index if not exists support_tickets_status_idx
  on public.support_tickets (status, created_at desc);
create index if not exists support_tickets_email_idx
  on public.support_tickets (lower(email));

alter table public.support_tickets enable row level security;

-- Private bucket for ticket attachments. Service-role uploads + signed URLs only;
-- never public. (storage.objects already has RLS on; service-role bypasses it,
-- so no object policies are needed for the server-side flow.)
-- file_size_limit + allowed_mime_types are enforced by Storage even for
-- signed-upload-URL writes, so the 50 MB cap and image/video allowlist hold
-- server-side (the API's own checks are advisory). Keep allowed_mime_types in
-- sync with ALLOWED_ATTACHMENT_TYPES in lib/support/tickets.ts. SVG is excluded
-- on purpose (it can carry executable script).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'support-attachments', 'support-attachments', false,
  52428800, -- 50 MB, matches MAX_ATTACHMENT_BYTES
  array[
    'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

# Support Tickets — How It Works (Intern Guide)

This is the support-ticket system: a page where **anyone** can report a bug or
ask a question and attach screenshots/screen recordings, and an internal page
where **the team** reads and resolves those tickets.

If you're new here, read the "Mental model" and "Run it locally" sections first,
then use the "File map" as a reference while you work.

---

## For interns: use it, break it, fix it

You're not here just to keep the support desk running — you're here to make the
product better. What that means day to day:

- **Use the OnlyWorks app.** Actually run it and rely on it. Dogfooding is the
  fastest way to find real bugs — the ones users would actually hit.
- **Report the bugs you find — through this system.** File them at `/support/tickets`
  with a screenshot or a screen recording. Yes, use the ticket flow you help build;
  that's the point, and it's also the best way to find *its* rough edges.
- **Then fix them.** Don't just file and forget. Pick the bug up, track down the
  cause, and ship the fix. Reporting *and* resolving is the job.

**The repos — don't mix them up:**

| Repo | What lives there |
|------|------------------|
| `onlyworks_verified` *(this repo)* | The marketing website **and** this support-ticket system. |
| `onlyworks-desktop-till-namkha-gets-back` *(OnlyWorksCodeHub org)* | **The OnlyWorks app itself** — the thing you download and run. Most product bugs get fixed here. (Yes, the repo name is a temporary placeholder.) |
| `ONLYWORKS_DIST` | The **distributions** — the built installers/binaries the website's Downloads page serves to users. New app builds get published here. |

Rule of thumb: a bug in the **ticket form or the triage page** → fix it here in
`onlyworks_verified`. A bug in **the app** (capture, sessions, reports, sign-in,
permissions) → fix it in the app repo, **`onlyworks-desktop-till-namkha-gets-back`**.

> **The app repo:** the OnlyWorks desktop app lives at
> **`OnlyWorksCodeHub/onlyworks-desktop-till-namkha-gets-back`** —
> `https://github.com/OnlyWorksCodeHub/onlyworks-desktop-till-namkha-gets-back.git`.
> **CI runs there.** (The name is a temporary placeholder — don't read into it.)

### Set up the app first

Before you can dogfood or fix anything, get the app running:

1. **Get access.** Ask your lead for access to the **OnlyWorksCodeHub** org
   (the app + `ONLYWORKS_DIST` repos), plus an OnlyWorks account to sign in with —
   the app **requires sign-in** (Google).
2. **Clone and run it.** Clone
   `https://github.com/OnlyWorksCodeHub/onlyworks-desktop-till-namkha-gets-back.git`,
   then follow that repo's own README for the exact install / build / run commands
   (they live in that repo, not this one).
3. **Set its env / config.** The app needs its environment configured (backend
   URL, Supabase, API keys) to reach the right services — see that repo's
   `.env.example`.
4. **Grant the macOS permissions.** On first launch it asks for **Screen
   Recording** and **Accessibility** (System Settings → Privacy & Security). It
   can't capture your work without both — add it under "Screen & System Audio
   Recording", *not* "System Audio Recording Only".

---

## 1. Mental model

There are two audiences and two pages:

| Who | Page | Needs login? |
|-----|------|--------------|
| A user with a problem | `/support/tickets` | No — just an email |
| Our team (triage) | `/admin/tickets` | Yes — **any** signed-in OnlyWorks account |

The flow, end to end:

```
  USER (browser)                      OUR APP (Next.js)                 SUPABASE
  ───────────────                     ─────────────────                 ────────
  1. fills form at
     /support/tickets
                                                                         
  2. picks a screenshot   ──POST──▶  /api/support-tickets/               mints a
                                     attachment-url            ──────▶  signed UPLOAD url
                                                               ◀──────  { path, token }
  3. uploads file DIRECTLY ─────────────────────────────────▶ private bucket
     browser → bucket                                          "support-attachments"
     (never through our server)

  4. submits the ticket   ──POST──▶  /api/support-tickets      ──────▶  INSERT row into
                                     (validates, checks files            support_tickets
                                      landed, saves paths)      ──────▶  Resend email to
                                                                         support@only-works.com
                                     ◀── { ref: "TKT-AB12CD" }

  TEAM MEMBER (signed in)
  ──────────────────────
  5. opens /admin/tickets ──GET───▶  /api/admin/tickets        ──────▶  SELECT tickets
                                     (mints short-lived        ──────▶  signed VIEW urls
                                      signed VIEW urls)                  for attachments
  6. changes status/notes ──PATCH─▶  /api/admin/tickets/[id]   ──────▶  UPDATE row
```

**The one non-obvious idea:** attachments go **straight from the browser into
Supabase Storage** using a signed upload URL. They do *not* pass through our API.
That's deliberate — serverless functions (Vercel) cap request bodies at ~4.5 MB,
which would kill video uploads. The signed-URL detour sidesteps that, so videos
up to 50 MB work.

---

## 2. File map

Everything lives under these paths. Start here when you need to change something.

| File | What it does |
|------|--------------|
| `app/support/tickets/page.tsx` | **Public submission form.** Drag-drop uploads, previews, progress, the reference-code success screen. |
| `app/admin/tickets/page.tsx` | **Triage dashboard.** Filter tabs, expandable tickets, inline image/video, status/priority/notes editing. |
| `app/api/support-tickets/attachment-url/route.ts` | Mints a one-time signed **upload** URL for one file. Validates type + size. |
| `app/api/support-tickets/route.ts` | Creates a ticket: validates fields, confirms each uploaded file exists, saves the row, emails the team. |
| `app/api/admin/tickets/route.ts` | `GET` — lists tickets + mints short-lived signed **view** URLs for attachments. |
| `app/api/admin/tickets/[id]/route.ts` | `PATCH` — updates a ticket's status / priority / internal notes. |
| `lib/support/tickets.ts` | **Shared contract.** Bucket name, categories, statuses, priorities, size/count limits, allowed file types, TypeScript types. Imported by everything above. Change limits/categories here. |
| `lib/auth.ts` | `requireAuth()` (any signed-in user) and `requireAdmin()` (ADMIN_EMAILS only). |
| `supabase/migrations/20260629_support_tickets.sql` | The `support_tickets` table + the private `support-attachments` bucket. |

Integration points (where the feature is linked from):
- `components/Footer.tsx` → "Support tickets" link
- `app/support/page.tsx` → the "Still stuck?" CTA and FAQ intro point to `/support/tickets`

---

## 3. Data model

**Table `public.support_tickets`** (see the migration for the full definition):

| Column | Notes |
|--------|-------|
| `id` | uuid, primary key |
| `ref` | human-friendly id, e.g. `TKT-7F3K2A` — this is what the user sees |
| `email` | required; the submitter's contact address |
| `name` | optional |
| `category` | `bug` \| `install` \| `account` \| `question` \| `other` |
| `subject`, `message` | required |
| `status` | `open` \| `in_progress` \| `resolved` |
| `priority` | `low` \| `normal` \| `high` |
| `attachments` | JSON array of `{ path, name, type, size }` — `path` points into the bucket |
| `admin_notes` | internal, never shown to the user |
| `user_id`, `ow_id` | filled in only if the submitter was signed in |
| `created_at`, `updated_at` | timestamps |

**Storage bucket `support-attachments`** — **private** (never public). Uploaded
files live at paths like `tickets/<random-hex>/<filename>`. Because it's private,
the only way to view a file is a **signed URL**, which the app mints server-side
and which expires after 1 hour.

**RLS:** the table has Row-Level Security on with **no policies**, so the browser's
anon key can't touch it directly. All reads/writes go through our API routes using
the Supabase **service-role** key (which bypasses RLS). That's why every DB
operation happens on the server.

---

## 4. Access control (read this carefully)

- **Submitting a ticket:** no login required. Anyone with an email can file one
  (so it works even when their app is broken and they can't sign in). If they
  happen to be signed in, we attach their verified identity to the row.
- **Triaging tickets (`/admin/tickets`):** requires being **signed in**, but with
  **any** OnlyWorks account (any email). This is enforced by `requireAuth()` in
  `lib/auth.ts`, which calls `supabase.auth.getUser()`.
  - ⚠️ This means **any signed-in account can read every ticket's contents and
    attachments** (other people's emails, messages, screenshots). That's an
    intentional product decision — don't "fix" it without asking.
- **`requireAuth()` vs `requireAdmin()`:** `requireAdmin()` additionally checks the
  email against `ADMIN_EMAILS` in `lib/config.ts`. It's used for **payouts and
  partners** routes (money), *not* tickets. Don't swap one for the other without
  understanding which surface you're touching.
- **Why `getUser()` and not `getSession()`:** `getSession()` just reads the cookie,
  which a client can forge. `getUser()` verifies the JWT with Supabase's auth
  server. Always use `getUser()` for anything that gates access.

---

## 5. Environment variables

The feature needs these set (locally in `.env.local`, and in the deployment). See
`.env.example` for the template. Nothing works without them:

| Var | Used for |
|-----|----------|
| `SUPABASE_URL` | server-side Supabase (service-role, admin) |
| `SUPABASE_SERVICE_ROLE_KEY` | server-side writes (bypasses RLS) — **secret**, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SUPABASE_URL` | browser client (the direct upload) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser client |
| `RESEND_API_KEY` | the "new ticket" email to the team (optional — without it, tickets still save, just no email) |

Get the Supabase values from the Supabase Dashboard → Settings → API. On Vercel,
`vercel env pull .env.local` copies them all locally.

---

## 6. Run it locally

```bash
# 1. Make sure .env.local has the Supabase + Resend vars (see section 5).
# 2. The migration must have been applied to the Supabase project ONCE
#    (creates the table + bucket). If it hasn't, paste
#    supabase/migrations/20260629_support_tickets.sql into the Supabase
#    SQL editor and run it. It's idempotent (safe to re-run).
npm install
npm run dev
```

Then:
1. Open <http://localhost:3000/support/tickets>, fill it out, drag in a screenshot,
   and submit. You should get a `TKT-XXXXXX` reference.
2. Open <http://localhost:3000/admin/tickets> (sign in first). Your ticket should
   appear, with the screenshot rendered inline. Change the status and hit save.

Before pushing, always run:

```bash
npx tsc --noEmit    # types
npm run lint        # eslint
npm run build       # catches prerender/runtime issues tsc misses
```

---

## 7. Common gotchas / FAQ

- **"Attachment storage is not set up yet"** — the `support-attachments` bucket
  doesn't exist. Run the migration (section 6).
- **Upload fails silently / build error about "Supabase URL and Key required"** —
  the `NEXT_PUBLIC_SUPABASE_*` vars aren't set. Note: the browser Supabase client
  is created **lazily** (only when a file is uploaded), on purpose, so the page can
  still statically prerender without those vars at build time.
- **SVGs are rejected.** Only `image/png|jpeg|gif|webp|heic|heif` and
  `video/mp4|webm|quicktime|x-m4v` are allowed (see `ALLOWED_ATTACHMENT_TYPES`).
  SVG is blocked because it can carry executable script. The bucket enforces the
  same allowlist server-side.
- **A user attached files then closed the tab without submitting.** Those files
  stay in the bucket as orphaned `tickets/<hex>/...` objects. That's accepted for
  now (they're private and harmless); a future cleanup job can sweep them.
- **No confirmation email to the submitter.** We only email the *team*. The user's
  only receipt is the on-screen reference code. The copy is written to reflect that
  ("a real person will email a reply") — keep it honest if you edit it.

---

## 8. Known limitations / good first tasks

- **No rate limiting / captcha** on the two anonymous endpoints
  (`/api/support-tickets` and `.../attachment-url`). The site already uses
  Cloudflare Turnstile on `/api/job-applications` — replicating that here is the
  obvious hardening (needs a Turnstile site key + secret).
- **No submitter confirmation email** (see FAQ). Could add a second Resend send.
- **Attachment size/type are validated in a few places.** The source of truth is
  `lib/support/tickets.ts` + the bucket's `file_size_limit`/`allowed_mime_types`.
  Change limits in both.

## 9. How to make common changes

- **Add a ticket category:** add it to `TICKET_CATEGORIES` in `lib/support/tickets.ts`.
  The form dropdown and the API validation both read from that list.
- **Change the file size limit or count:** `MAX_ATTACHMENT_BYTES` / `MAX_ATTACHMENTS`
  / `MAX_TOTAL_BYTES` in `lib/support/tickets.ts` — and update the bucket's
  `file_size_limit` in a new migration so Storage enforces it too.
- **Add a status or priority:** extend `TICKET_STATUSES` / `TICKET_PRIORITIES` in
  the shared lib; the admin dropdowns and the PATCH validation follow automatically.

## 10. Deploy

Production is the `main` branch on Vercel. The flow is: push your branch → open a
PR into `main` → once checks (GitGuardian + Vercel preview build) pass, merge it →
Vercel deploys `main` to production automatically. Never commit secrets; GitGuardian
will block the PR if you do.

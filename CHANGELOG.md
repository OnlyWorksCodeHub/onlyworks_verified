# Changelog

All notable changes to OnlyWorks are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — 2026-06-01

### Added — ONLYWEIRD '26 hackathon microsite (`/hackathon/*`)

A multi-page event microsite for OnlyWorks' first hackathon, framed as a
conversion funnel for the OnlyWorks platform itself.

- `app/hackathon/layout.tsx` — dark-to-bone shell, scoped chrome
  (`HackathonNav` + `HackathonFooter`), shared metadata
- `app/hackathon/page.tsx` — landing page with hero, three commandments
  (◆ ○ ◌), manifesto + spec card, seven-day week timeline, four tracks,
  prize tree, eight-rule TLDR, sponsor row, final CTA
- `app/hackathon/schedule/page.tsx` — full week program. 8 days × ~5
  events. PT/ET/UTC time-zone toggle. Live/async/in-person/optional/
  sponsor tag filter. Finals day (Tue 23 Jun) gets vermilion treatment
- `app/hackathon/projects/page.tsx` — pre-launch "Hall of Weird"
  exhibition wall with 9 exemplar projects, track filter, big
  submissions-open countdown block, how-to-submit walkthrough
- `app/hackathon/register/page.tsx` — registration form (9 fields,
  conditional team-name + dietary inputs), state machine
  `intro → idle → submitting → done`. Submission produces a stamped
  `OW-WEIRD-XXXX` serial. Real Supabase write left as a TODO
- `app/hackathon/rules/page.tsx` — eight numbered sections of rules
  (eligibility, build window, AI policy, submissions, judging, conduct,
  ownership, misc) + 10-item collapsible FAQ + table of contents
- `app/hackathon/certificate/page.tsx` — landscape brutalist certificate
  wireframe with recipient, project, award, serial, sample QR, hash,
  three signature lines, wax-style verified stamp. Print-friendly via
  `@media print`. Below the cert: a 3-step verification explainer
  ending in a Download OnlyWorks CTA

### Added — Hackathon components (`components/hackathon/`)

- `HackathonNav.tsx` — sticky poster header, sticky on scroll, vermilion
  Register CTA, mobile menu, "↩ ONLYWORKS" back link
- `HackathonFooter.tsx` — dark colophon footer with massive ONLYWEIRD
  '26 wordmark, four-column link grid, set-in / typography credits
- `Countdown.tsx` — live countdown to `2026-06-16T16:00:00Z` (kickoff,
  09:00 PT). Full and compact display modes. SSR-safe placeholder
- `VerifiedCounter.tsx` — animated builder-count display (simulated,
  not yet wired to real Supabase count)
- `WeirdMarquee.tsx` — full-bleed marquee bar of weird build ideas;
  supports `inverted` (vermilion) variant

### Added — Hackathon stylesheet (`app/hackathon/hackathon.css`)

Scoped to `.hackathon-shell`. Brutalist art-poster aesthetic:

- **Palette** — bone `#f1ece2`, charcoal `#1c1b18`, single accent
  vermilion `#e63a13`. Warm muted greys for body copy
- **Type** — Big Shoulders Display (headlines), Bricolage Grotesque
  (body); both via Google Fonts
- **Primitives** — `.ow-btn` (chunky with offset shadow), `.ow-input`
  (hairline underline, full border for textarea/select), `.ow-card`
  (hairline border + ink shadow, vermilion shadow on hover),
  `.ow-stamp` (rotated faux-rubber-stamp with ink-bleed text-shadow),
  `.ow-section-mark` (§ section markers), `.ow-bignum` (poster
  numerals with tabular nums), `.ow-marquee-bar`
- **Effects** — paper-grain SVG noise overlay (multiply blend),
  page-bottom stain gradient, hand-drawn squiggle divider, stagger
  reveal, stamp pop-in + gentle wobble (respects `prefers-reduced-motion`)

### Added — OnlyWorks documentation on `/about`

Three new sections inserted between "Why we exist" and "Metrics" on the
existing about page. Match the OW main-site idiom (Instrument Serif/Sans,
cream bg, purple `#8b5cf6` accent, framer-motion entrance).

- `#how-it-works` — three-step explainer (Install / Verify / Share) with
  per-step Download / sample-report deep links
- `#sample` — mock report-card preview rendered as a faux browser tab,
  showing skills detected / evidence / hash + signature
- `#hackathon` — six-step path tailored to ONLYWEIRD '26 builders
  (register → install → hook → build → submit → cert), each step deep-
  linking back into the appropriate hackathon route

### Added — Pre-register conversion gate (`/hackathon/register`)

- `IntroGate` component shown before the registration form on first
  visit. Three-card explainer (capture / sign / verify) + paired CTA:
  primary "Take me to the intro" (→ `/about#how-it-works`) + ghost
  "I know OW — register me"
- Skip state persisted in `localStorage` under
  `onlyweird-26-seen-intro` so returners hit the form directly
- Both CTA paths mark the visitor as seen, so navigating to docs and
  back doesn't re-trigger the gate

### Decisions baked into the site

- **Prize budget capped at $1,000 cash** (grand only). Track + secondary
  prizes are non-cash (OW Pro accounts, judge mentorship, Hall of Weird
  placement, joke trophies). Judge-named $250 awards listed as "Also
  coming" — judge-funded, names announced at kickoff
- **Hackathon as conversion funnel** — every artefact (certificate,
  intro gate, /about hackathon section) routes back into the OnlyWorks
  product. Memory locked in `memory/project_onlyweird_objective.md`

### Known placeholders to swap before launch

1. **Judge mentorship copy** — appears in `app/hackathon/page.tsx` §05
   as "Mentorship from the judging panel · details confirmed at
   kickoff" and "Mentorship intro from a panel judge". Replace with
   the concrete promise once judges have confirmed (e.g. "30-min 1:1
   with each guest judge")
2. **Registration backend** — the form in
   `app/hackathon/register/page.tsx` simulates submission. The
   `TODO(weird@only-works.com)` comment marks where the real Supabase
   insert into a `hackathon_registrations` table belongs. RLS + captcha
   + email-verification flow needed before opening
3. **Verified-weird counter** — `VerifiedCounter` displays simulated
   numbers. Wire to a `count(*)` of real `hackathon_registrations` when
   the table exists
4. **Certificate QR** — `FakeQR` in
   `app/hackathon/certificate/page.tsx` is decorative SVG. Replace with
   a real QR encoding the verify URL when shipping
5. **Sponsor logos** — `[ your logo ]` placeholders in the landing
   sponsor row. Drop in real logos as sponsors confirm
6. **OnlyWorks v2 docs drift** — the `/about` documentation describes
   current OW behaviour. As v2 ships, search `app/about/page.tsx` for
   strings like `install the hook`, `one-line install`,
   `onlyworks.com/verify/<hash>` and update to match v2's actual
   surfaces

### Documentation files in `memory/`

These persist between Claude sessions so future work stays consistent:

- `feedback_design_direction_weird_artsy.md` — user prefers
  zine/collage/poster aesthetics over terminal/techy
- `project_onlyweird_prize_budget.md` — $1k cash cap, judge access
  placeholder, structural decisions
- `project_onlyweird_objective.md` — hackathon's primary objective is
  driving OW adoption; OW v2 being built in parallel

---

[Unreleased]: https://github.com/anthropics/onlyworks-verified/compare/main...HEAD

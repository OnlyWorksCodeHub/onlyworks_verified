// Canonical ONLYWEIRD '26 event facts — ONE source of truth so copy can't
// drift between the site, the metadata, and the confirmation email. The
// confirmation email previously hard-coded a stale "24-hour / Friday 19 June"
// window; sourcing it here keeps it locked to the real schedule.
//
// Kickoff timestamp also lives in components/hackathon/Countdown.tsx
// (2026-06-18T21:00:00Z = 17:00 EDT on 18 Jun) — keep the two in agreement.

export const EVENT = {
  durationLabel: '48-hour',
  opensLong: 'Thursday 18 June · 17:00 ET',
  hardCloseLong: 'Saturday 20 June · 17:00 ET',
  finalsPhrase: 'winners and awards announced in July',
}

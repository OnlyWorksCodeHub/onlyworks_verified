'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Countdown } from '@/components/hackathon/Countdown'

type TZ = 'PT' | 'ET' | 'UTC'

interface Event {
  pt: string
  title: string
  body: string
  tag?: 'live' | 'async' | 'finals' | 'optional' | 'sponsor'
}

interface Day {
  id: string
  date: string
  weekday: string
  mood: string
  events: Event[]
}

const PT_OFFSET = -7
const ET_OFFSET = -4

function shiftTime(hhmm: string, tz: TZ) {
  const [h, m] = hhmm.split(':').map(Number)
  const ptMinutes = h * 60 + m
  let target = ptMinutes
  if (tz === 'ET')  target = ptMinutes + (ET_OFFSET - PT_OFFSET) * 60
  if (tz === 'UTC') target = ptMinutes + (0 - PT_OFFSET) * 60
  while (target < 0)        target += 24 * 60
  while (target >= 24 * 60) target -= 24 * 60
  const hh = Math.floor(target / 60)
  const mm = target % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

const DAYS: Day[] = [
  {
    id: 'thu-18', weekday: 'Thursday', date: '18 Jun 2026', mood: 'Kickoff · clock starts · scaffolding day',
    events: [
      { pt: '05:30', title: 'Pre-show',                       body: 'Discord opens. Coffee opens. The stream waiting room is the lobby track.', tag: 'live' },
      { pt: '06:00', title: 'Kickoff stream',                 body: "OnlyWorks × Orbis read the manifesto. An Orbis demo. One (1) accidental swear word.", tag: 'live' },
      { pt: '06:15', title: 'Build window begins',            body: '48-hour clock starts. Commit hashes after this point count. Previous ones do not.', tag: 'async' },
      { pt: '06:30', title: 'Theme reveal',                   body: 'This year there is no theme. You are the theme. It has been verified.', tag: 'live' },
      { pt: '07:00', title: 'Judge introductions',            body: 'Guest judges + the OnlyWorks panel. Each reveals their personal weird north star.', tag: 'live' },
      { pt: '07:30', title: 'Team formation',                 body: 'Discord channels by track. Solos welcome. Matchmaking bot deployed.', tag: 'optional' },
      { pt: '09:00', title: 'Office hours · OnlyWorks API',   body: 'How to wire your build to OnlyWorks for verification. Demo + Q&A.', tag: 'sponsor' },
      { pt: '17:00', title: 'Late-shift radio',               body: 'Lo-fi stream from a stranger in a basement. Opt-in for night-builders.', tag: 'optional' },
    ],
  },
  {
    id: 'fri-19', weekday: 'Friday', date: '19 Jun 2026', mood: 'Middle day · the project starts arguing back',
    events: [
      { pt: '07:00', title: 'Sync-down',                       body: '15 min checkin stream. Show your scaffold, your first crime.', tag: 'live' },
      { pt: '09:00', title: 'Office hours · vibes (open)',     body: 'Open mentor desk. Drop a question. Someone will answer. It may even help.', tag: 'optional' },
      { pt: '11:00', title: 'Craft talk · 30 min',             body: "Guest TBA — we're courting an engineer who builds joke games that ship to real app stores.", tag: 'sponsor' },
      { pt: '14:00', title: 'Office hours · design crit',      body: 'Screenshare your UI. Receive opinions. The opinions are correct.', tag: 'sponsor' },
      { pt: '18:00', title: 'Happy half-hour',                 body: 'Tea/beer/club-mate of your choosing. A brief, warm reminder you are nearly through.', tag: 'optional' },
      { pt: '20:00', title: 'Overnight IRC',                   body: 'A real (text-only) IRC channel opens for the all-nighter people.', tag: 'optional' },
    ],
  },
  {
    id: 'sat-20', weekday: 'Saturday', date: '20 Jun 2026', mood: 'Submissions close · NYC finals · the door reveal',
    events: [
      { pt: '04:00', title: 'Last sync-down',                  body: 'Last one. Shorter than yesterday. Brace.', tag: 'live' },
      { pt: '05:30', title: 'Submissions soft close',          body: 'Judges begin watching. You may keep editing your README. Nobody else may.', tag: 'async' },
      { pt: '06:00', title: 'Submissions close (HARD)',        body: '48 hours up (09:00 ET). Anything pushed after this is for posterity, not points.', tag: 'async' },
      { pt: '10:00', title: 'Finalists announced',             body: 'Eight (8) projects. Emails sent at 13:00 ET — get to NYC if you can.', tag: 'live' },
      { pt: '12:00', title: 'Finalist call · briefing',        body: 'Finalists hop on a private call to walk through the order, the room, the rules.', tag: 'live' },
      { pt: '14:00', title: 'Doors open · NYC finals venue',   body: "An unmarked door in NYC. Address shared with finalists and RSVP'd attendees alongside the 13:00 ET announcement.", tag: 'finals' },
      { pt: '15:00', title: 'Demos · round 1',                 body: 'Four projects, three minutes each, ruthless Q&A. Snack budget is generous.', tag: 'finals' },
      { pt: '16:00', title: 'Intermission · weird tribute',    body: 'A short film honouring the projects that did not make finals. They were good.', tag: 'finals' },
      { pt: '16:30', title: 'Demos · round 2',                 body: 'The other four. The judges look tired but exhilarated. So do you.', tag: 'finals' },
      { pt: '17:45', title: 'Judges deliberate',               body: 'The bar opens. You do not. That is for the audience.', tag: 'finals' },
      { pt: '18:30', title: 'Awards ceremony',                 body: 'Track + secondary prizes announced; grand prize winner revealed end of July. Trophies handed out. The trophies are themselves a joke.', tag: 'finals' },
      { pt: '19:30', title: 'After-hours weirdtape',           body: 'Open jam · open mic · open mind. Recording strongly discouraged.', tag: 'finals' },
    ],
  },
]

const TAG_META: Record<string, { label: string; fg: string; bg: string }> = {
  'live':       { label: 'Live',       fg: 'var(--ow-paper)', bg: 'var(--ow-ink)' },
  'async':      { label: 'Async',      fg: 'var(--ow-ink)',   bg: 'transparent'   },
  'finals':     { label: 'Finals',     fg: 'var(--ow-paper)', bg: 'var(--ow-red)' },
  'optional':   { label: 'Optional',   fg: 'var(--ow-ink)',   bg: 'var(--ow-paper-deep)' },
  'sponsor':    { label: 'Sponsor',    fg: 'var(--ow-ink)',   bg: 'var(--ow-paper-warm)' },
}

export default function SchedulePage() {
  const [tz, setTz] = useState<TZ>('ET')
  const [filter, setFilter] = useState<string | 'all'>('all')

  return (
    <>
      <section style={{ paddingTop: 56, paddingBottom: 32 }}>
        <div className="ow-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
            <Link href="/hackathon" className="no-underline" style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--ow-ink-3)',
            }}>↩ Index</Link>
            <span className="ow-stamp ow-stamp-tilt-r">Schedule v1 · Subject to change</span>
          </div>

          <div style={{
            marginTop: 28,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(0.875rem, 1.4vw, 1.0625rem)',
            letterSpacing: '-0.005em',
            color: 'var(--ow-ink)',
          }}>
            only hacks <span style={{ color: 'var(--ow-ink-3)' }}>for</span> <span style={{ color: 'var(--ow-red)' }}>the&nbsp;onlyweird.</span>
          </div>

          <h1 style={{ marginTop: 6 }}>
            Schedule.<wbr /><span style={{ color: 'var(--ow-red)' }}>txt</span>
          </h1>

          <hr className="ow-rule-fat" style={{ marginTop: 8 }} />

          <p className="lede" style={{ marginTop: 24, maxWidth: 720 }}>
            48 hours, one terminal door. All times in ET by default (NYC time) — switch zones below. <strong style={{ color: 'var(--ow-ink)' }}>Live</strong> items stream; <strong style={{ color: 'var(--ow-red)' }}>finals</strong> items happen at the NYC finals venue on 20 Jun; <strong style={{ color: 'var(--ow-ink)' }}>optional</strong> items are explicitly opt-in.
          </p>

          {/* control bar */}
          <div
            style={{
              marginTop: 36,
              border: '2px solid var(--ow-ink)',
              boxShadow: '5px 5px 0 0 var(--ow-ink)',
              padding: 22,
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between',
              gap: 22,
              background: 'var(--ow-paper)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <span className="ow-label">Display in</span>
              {(['PT', 'ET', 'UTC'] as TZ[]).map(z => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setTz(z)}
                  style={{
                    background: tz === z ? 'var(--ow-ink)' : 'transparent',
                    color: tz === z ? 'var(--ow-paper)' : 'var(--ow-ink)',
                    border: '2px solid var(--ow-ink)',
                    padding: '8px 16px',
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.8125rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >{z}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="ow-label ow-label-mute">Kickoff in</span>
              <span className="ow-serial" style={{ color: 'var(--ow-ink)', fontSize: '1.125rem' }}>
                <Countdown compact />
              </span>
            </div>
          </div>

          {/* tag filter */}
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span className="ow-label ow-label-mute" style={{ marginRight: 6 }}>Filter →</span>
            <button
              type="button"
              onClick={() => setFilter('all')}
              style={{
                background: filter === 'all' ? 'var(--ow-ink)' : 'transparent',
                color: filter === 'all' ? 'var(--ow-paper)' : 'var(--ow-ink)',
                border: '2px solid var(--ow-ink)',
                padding: '6px 14px',
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 700, fontSize: '0.75rem',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              All
            </button>
            {Object.keys(TAG_META).map(t => {
              const meta = TAG_META[t]
              const active = filter === t
              const isRed = t === 'finals'
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  style={{
                    border: `2px solid ${isRed ? 'var(--ow-red)' : 'var(--ow-ink)'}`,
                    background: active ? (isRed ? 'var(--ow-red)' : 'var(--ow-ink)') : 'transparent',
                    color: active ? 'var(--ow-paper)' : (isRed ? 'var(--ow-red)' : 'var(--ow-ink)'),
                    padding: '6px 14px',
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontWeight: 700, fontSize: '0.75rem',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 64 }}>
        <div className="ow-container" style={{ display: 'grid', gap: 36 }}>
          {DAYS.map((day, idx) => {
            const visible = filter === 'all' ? day.events : day.events.filter(e => e.tag === filter)
            const isFinals = day.id === 'sat-20'
            return (
              <article
                key={day.id}
                id={day.id}
                style={{
                  border: isFinals ? '3px solid var(--ow-red)' : '2px solid var(--ow-ink)',
                  background: 'var(--ow-paper)',
                  boxShadow: isFinals ? '8px 8px 0 0 var(--ow-ink)' : '6px 6px 0 0 var(--ow-ink)',
                }}
              >
                {/* day header */}
                <header style={{
                  padding: '24px 28px',
                  borderBottom: '2px solid var(--ow-ink)',
                  background: isFinals ? 'var(--ow-red)' : 'var(--ow-paper-warm)',
                  color: isFinals ? 'var(--ow-paper)' : 'var(--ow-ink)',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'baseline',
                  gap: 28,
                }}
                  className="ow-day-head"
                >
                  <span className="ow-bignum" style={{
                    fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
                    color: isFinals ? 'var(--ow-paper)' : 'var(--ow-ink)',
                    lineHeight: 0.88,
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "'Big Shoulders Display', sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                      lineHeight: 0.92,
                    }}>
                      {day.weekday} <span style={{ color: isFinals ? 'rgba(241,236,226,0.8)' : 'var(--ow-ink-3)' }}>· {day.date}</span>
                    </div>
                    <div style={{
                      marginTop: 8,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontStyle: 'italic',
                      fontSize: '0.9375rem',
                      color: isFinals ? 'rgba(241,236,226,0.85)' : 'var(--ow-ink-2)',
                    }}>
                      {day.mood}
                    </div>
                  </div>
                  {isFinals && (
                    <span className="ow-stamp ow-stamp-tilt-l ow-stamp-pop" style={{
                      borderColor: 'var(--ow-paper)',
                      color: 'var(--ow-paper)',
                      background: 'transparent',
                      boxShadow: '1.5px 1.5px 0 rgba(241,236,226,0.25)',
                    }}>
                      ◆ Final Door
                    </span>
                  )}
                </header>

                {visible.length === 0 ? (
                  <div style={{ padding: 28, fontSize: '0.875rem', color: 'var(--ow-ink-3)' }}>
                    No events of type <strong>{filter}</strong> on this day. Switch filter to view.
                  </div>
                ) : (
                  <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {visible.map((e, i) => {
                      const meta = e.tag ? TAG_META[e.tag] : null
                      return (
                        <li
                          key={i}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(120px, 150px) minmax(120px, 150px) 1fr',
                            gap: 24,
                            padding: '20px 28px',
                            borderBottom: i === visible.length - 1 ? 'none' : '1px solid var(--ow-ink)',
                            alignItems: 'baseline',
                          }}
                          className="ow-event-row"
                        >
                          <span className="ow-bignum" style={{
                            fontSize: '1.875rem',
                            color: 'var(--ow-ink)',
                            letterSpacing: '0',
                          }}>
                            {shiftTime(e.pt, tz)}
                          </span>
                          <span>
                            {meta && (
                              <span style={{
                                display: 'inline-block',
                                background: meta.bg,
                                color: meta.fg,
                                border: meta.bg === 'transparent' ? '1px solid var(--ow-ink)' : 'none',
                                padding: '4px 10px',
                                fontFamily: "'Big Shoulders Display', sans-serif",
                                fontWeight: 800, fontSize: '0.6875rem',
                                letterSpacing: '0.18em', textTransform: 'uppercase',
                              }}>
                                {meta.label}
                              </span>
                            )}
                          </span>
                          <div>
                            <div style={{
                              fontFamily: "'Big Shoulders Display', sans-serif",
                              fontWeight: 800,
                              fontSize: '1.25rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.005em',
                              color: 'var(--ow-ink)',
                            }}>{e.title}</div>
                            <div style={{ fontSize: '0.9375rem', color: 'var(--ow-ink-2)', marginTop: 4 }}>
                              {e.body}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="ow-container">
          <div style={{
            border: '2px solid var(--ow-ink)',
            background: 'var(--ow-ink)',
            color: 'var(--ow-paper)',
            padding: 36,
            display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'center', gap: 28,
          }}
            className="ow-final-cta"
          >
            <div>
              <div style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 700, fontSize: '0.6875rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(241,236,226,0.55)',
                marginBottom: 6,
              }}>
                Schedule changes
              </div>
              <h2 style={{ color: 'var(--ow-paper)', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
                Registering pins this<br />
                <span style={{ color: 'var(--ow-red)' }}>to your calendar.</span>
              </h2>
              <p style={{ color: 'rgba(241,236,226,0.8)', marginTop: 12, maxWidth: 640 }}>
                Calendar invites for everything tagged <strong style={{ color: 'var(--ow-paper)' }}>live</strong> and <strong style={{ color: 'var(--ow-red)' }}>finals</strong> land by email before kickoff. <strong style={{ color: 'var(--ow-paper)' }}>Optional</strong> items stay off your calendar unless you ask.
              </p>
            </div>
            <Link href="/hackathon/register" className="ow-btn ow-btn-primary no-underline" style={{ alignSelf: 'center' }}>
              Register →
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 800px) {
            .ow-event-row { grid-template-columns: 1fr !important; gap: 8px !important; }
            .ow-day-head  { grid-template-columns: 1fr !important; gap: 14px !important; }
            .ow-final-cta { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  )
}

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Countdown } from '@/components/hackathon/Countdown'

type Track = 'useless' | 'cursed' | 'beautiful' | 'theatre'

interface Exemplar {
  id: string
  title: string
  track: Track
  verdict: string
  description: string
  stack: string[]
}

const SUBS_OPEN = new Date('2026-06-18T17:00:00-04:00')

const EXEMPLARS: Exemplar[] = [
  {
    id: '001',
    title: 'kettle.sh',
    track: 'useless',
    verdict: 'A bash script that boils water by curling a smart kettle. Takes 14 minutes. You cannot stop it. It returns exit code 0.',
    description: 'Small, complete, beautifully documented. Installs in one line. Boils water through six different async transports.',
    stack: ['bash', 'curl', 'smart-kettle-api', 'patience'],
  },
  {
    id: '002',
    title: 'regret.osc',
    track: 'beautiful',
    verdict: 'An oscilloscope visualisation of your terminal history weighted by `git revert` frequency. Drawn on a CRT. A real one.',
    description: 'Maps the rhythm of your commit graveyard to a sine wave on an analog scope. Ships with photos of the rig and a 30-second Loom.',
    stack: ['python', 'libserial', 'oscilloscope', 'an old polaroid'],
  },
  {
    id: '003',
    title: 'auth-by-vibe',
    track: 'cursed',
    verdict: 'Logs you in if your webcam picture has the right vibe. Trained on 4 images of the developer. 81% accurate.',
    description: 'Unironically functional. Terrifyingly accurate at recognising "early morning" vs "post-lunch" you. Ships with a confession.',
    stack: ['react', 'tfjs', 'one (1) ring light'],
  },
  {
    id: '004',
    title: 'haiku-shell',
    track: 'beautiful',
    verdict: 'A shell that responds in 5-7-5 haiku. Every command. Every error. Every man page.',
    description: 'The haiku for `rm -rf /` is genuinely upsetting. So are the haiku for `ls`. So are the haiku for everything. It is good.',
    stack: ['rust', 'shell', 'a borrowed thesaurus'],
  },
  {
    id: '005',
    title: 'demo-only',
    track: 'theatre',
    verdict: 'The entire project is a 3-minute live demo. There is no repository. You cannot install it. You had to be there.',
    description: 'Could win a category despite (because of) shipping precisely zero source code. The demo IS the artefact.',
    stack: ['breath', 'lights', 'a smoke machine'],
  },
  {
    id: '006',
    title: 'vending-oracle',
    track: 'theatre',
    verdict: 'A real vending machine dispensing real snacks AND unsolicited career advice via a thermal printer. Built to be shown off in a ≤3-min pitch video.',
    description: 'Picture it: insert $1.25, receive a granola bar and a sentence such as "your refactor will not save you, only joy will".',
    stack: ['esp32', 'thermal printer', 'gpt-4o-mini', 'a tired vending machine'],
  },
  {
    id: '007',
    title: 'cron-confess',
    track: 'cursed',
    verdict: "A cron job that, once a week, posts a short confession to your team's Slack from a generic bot account. The confessions are real.",
    description: 'Features a moderation step where you approve each one. You usually approve them at 1am. They are weird.',
    stack: ['python', 'slack webhook', 'a generic bot account'],
  },
  {
    id: '008',
    title: 'static-radio',
    track: 'beautiful',
    verdict: 'A one-page site that plays the static between FM stations as ambient audio. The static cycles. You can leave it open.',
    description: 'It is just a webpage that plays static. It is genuinely calming. CSS is perfect. Type is perfect. Footer: "i am sorry, this is the project."',
    stack: ['html', 'css', 'one (1) .ogg file'],
  },
  {
    id: '009',
    title: 'css-barometer',
    track: 'useless',
    verdict: 'A webpage that visualises atmospheric pressure as a slowly heaving div. No JS. CSS gradient driven off geolocation + remote feed.',
    description: 'Opens to a perfectly still page. You do not notice it is breathing until you go away and come back.',
    stack: ['css', 'gradient', 'breath'],
  },
]

const TRACK_META: Record<Track, { label: string; n: string; red?: boolean }> = {
  useless:   { label: 'Useless Engineering', n: 'A' },
  cursed:    { label: 'Cursed Technology',   n: 'B', red: true },
  beautiful: { label: 'Beautiful Trash',     n: 'C' },
  theatre:   { label: 'Demo Theatre',        n: 'D', red: true },
}

export default function ProjectsPage() {
  const [track, setTrack] = useState<Track | 'all'>('all')

  const visible = useMemo(
    () => (track === 'all' ? EXEMPLARS : EXEMPLARS.filter(e => e.track === track)),
    [track],
  )

  return (
    <>
      <section style={{ paddingTop: 56, paddingBottom: 48 }}>
        <div className="ow-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
            <Link href="/hackathon" className="no-underline" style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--ow-ink-3)',
            }}>↩ Index</Link>
            <span className="ow-stamp ow-stamp-tilt-l">◆ Inspiration board</span>
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
            Hall of<br />
            <span style={{ color: 'var(--ow-red)' }}>weird.</span>
          </h1>

          <hr className="ow-rule-fat" style={{ marginTop: 8 }} />

          <p className="lede" style={{ marginTop: 24, maxWidth: 720 }}>
            This wall will host live ONLYHACKS for the ONLYWEIRD &apos;26 submissions once the window opens. Until then it&apos;s the <em style={{ fontStyle: 'normal', color: 'var(--ow-red)' }}>inspiration board</em> — projects close to the flavour we&apos;re after. Consider them invitations. Do not consider them rubrics.
          </p>

          {/* big submissions-open block */}
          <div
            style={{
              marginTop: 36,
              border: '2px solid var(--ow-ink)',
              background: 'var(--ow-paper)',
              padding: 32,
              boxShadow: '6px 6px 0 0 var(--ow-red)',
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              alignItems: 'flex-end',
              gap: 32,
            }}
            className="ow-subopen"
          >
            <div>
              <div className="ow-label">Submissions open</div>
              <div className="ow-bignum" style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                color: 'var(--ow-ink)',
                marginTop: 10,
                lineHeight: 0.9,
              }}>
                18 JUN ’26<br />
                <span style={{ color: 'var(--ow-red)' }}>17:00 ET</span>
              </div>
              <p style={{ marginTop: 14, fontSize: '0.9375rem', maxWidth: 520 }}>
                Soft close 20 Jun 16:30 ET. <strong style={{ color: 'var(--ow-red)' }}>Hard close 20 Jun 17:00 ET.</strong> The door does not negotiate.
              </p>
            </div>
            <div>
              <Countdown target={SUBS_OPEN} compact />
            </div>
          </div>
        </div>
      </section>

      {/* filter bar */}
      <section style={{ paddingBottom: 28 }}>
        <div className="ow-container">
          <div
            style={{
              display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
              alignItems: 'center', gap: 14,
              padding: '14px 18px',
              borderTop: '2px solid var(--ow-ink)',
              borderBottom: '2px solid var(--ow-ink)',
              background: 'var(--ow-paper-warm)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <span className="ow-label ow-label-mute">Filter →</span>
              <button
                type="button"
                onClick={() => setTrack('all')}
                style={{
                  background: track === 'all' ? 'var(--ow-ink)' : 'transparent',
                  color: track === 'all' ? 'var(--ow-paper)' : 'var(--ow-ink)',
                  border: '2px solid var(--ow-ink)',
                  padding: '6px 14px',
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 700, fontSize: '0.75rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                All ({EXEMPLARS.length})
              </button>
              {(Object.keys(TRACK_META) as Track[]).map(t => {
                const meta = TRACK_META[t]
                const count = EXEMPLARS.filter(e => e.track === t).length
                const active = track === t
                const accent = meta.red ? 'var(--ow-red)' : 'var(--ow-ink)'
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrack(t)}
                    style={{
                      background: active ? accent : 'transparent',
                      color: active ? 'var(--ow-paper)' : accent,
                      border: `2px solid ${accent}`,
                      padding: '6px 14px',
                      fontFamily: "'Big Shoulders Display', sans-serif",
                      fontWeight: 700, fontSize: '0.75rem',
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {meta.label} ({count})
                  </button>
                )
              })}
            </div>
            <span className="ow-label ow-label-mute">
              Showing {visible.length} / {EXEMPLARS.length}
            </span>
          </div>
        </div>
      </section>

      {/* exhibition grid */}
      <section style={{ paddingBottom: 96 }}>
        <div className="ow-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 22,
        }}>
          {visible.map(e => {
            const meta = TRACK_META[e.track]
            return (
              <article
                key={e.id}
                className="ow-card"
                style={{
                  padding: 26,
                  display: 'flex', flexDirection: 'column', gap: 14,
                }}
              >
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="ow-bignum" style={{
                    fontSize: '1.5rem',
                    color: 'var(--ow-ink-3)',
                  }}>
                    Nº {e.id}
                  </span>
                  <span style={{
                    display: 'inline-block',
                    background: meta.red ? 'var(--ow-red)' : 'var(--ow-ink)',
                    color: 'var(--ow-paper)',
                    padding: '4px 10px',
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontWeight: 800, fontSize: '0.6875rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                  }}>
                    {meta.n} · {meta.label}
                  </span>
                </header>

                <hr className="ow-rule" />

                <div>
                  <h3 style={{
                    fontSize: '2rem',
                    textTransform: 'none',
                    fontWeight: 800,
                    letterSpacing: '-0.012em',
                    lineHeight: 1,
                  }}>
                    {e.title}
                  </h3>
                  <div className="ow-label ow-label-mute" style={{ marginTop: 6 }}>
                    Dreamt up by the organizers · not a submission
                  </div>
                </div>

                <p style={{ fontSize: '0.9375rem', color: 'var(--ow-ink)', fontWeight: 500 }}>
                  {e.verdict}
                </p>
                <p style={{ fontSize: '0.875rem' }}>{e.description}</p>

                <hr className="ow-rule" style={{ marginTop: 'auto' }} />

                <footer style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {e.stack.map(s => (
                    <span key={s} style={{
                      fontFamily: "'Big Shoulders Display', sans-serif",
                      fontWeight: 600,
                      fontSize: '0.6875rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--ow-ink-2)',
                      padding: '3px 8px',
                      border: '1px solid var(--ow-ink-3)',
                    }}>
                      {s}
                    </span>
                  ))}
                </footer>
              </article>
            )
          })}

          {/* open slot card */}
          <article
            style={{
              border: '2px dashed var(--ow-ink-3)',
              padding: 26,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 280,
              color: 'var(--ow-ink-2)',
            }}
          >
            <div>
              <span className="ow-label ow-label-mute">Slot · open</span>
              <h3 style={{
                fontSize: '2rem',
                color: 'var(--ow-ink-3)',
                marginTop: 8,
                textTransform: 'none',
                fontWeight: 800,
                letterSpacing: '-0.012em',
                lineHeight: 1,
              }}>
                Your project<br />here.
              </h3>
              <p style={{ marginTop: 12, fontSize: '0.875rem' }}>
                When submissions open, real projects take over this wall. The slot is yours.
              </p>
            </div>
            <Link href="/hackathon/register" className="ow-btn no-underline" style={{ alignSelf: 'flex-start', marginTop: 18 }}>
              Claim slot →
            </Link>
          </article>
        </div>
      </section>

      {/* how to submit */}
      <section style={{
        paddingBottom: 96,
        background: 'var(--ow-paper-warm)',
        borderTop: '2px solid var(--ow-ink)',
        borderBottom: '2px solid var(--ow-ink)',
        paddingTop: 80,
      }}>
        <div className="ow-container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 14,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 800,
            fontSize: '0.875rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--ow-ink)',
          }}>
            <span style={{ display: 'inline-block', width: 56, height: 2, background: 'var(--ow-ink)' }} />
            <span>§ Submit</span>
            <span style={{ color: 'var(--ow-ink-3)' }}>—</span>
            <span>How to submit</span>
          </div>

          <h2 style={{ marginTop: 18 }}>
            Ship<br />
            <span style={{ color: 'var(--ow-red)' }}>the thing.</span>
          </h2>

          <ol style={{
            listStyle: 'none', padding: 0, margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
            marginTop: 48,
          }}>
            {[
              { title: 'Register your project', body: 'From your dashboard, hit "new submission". The form is two fields: title and category. You can rename later.' },
              { title: 'Wire to OnlyWorks',     body: 'One-time hook. Drops a small file in your repo so OW can verify the build is real. Takes 30 seconds.' },
              { title: 'Record your pitch video', body: 'The deliverable judges actually score — ≤3 min. Demo the artefact actually running. One take is fine. One take is, in fact, recommended.' },
              { title: 'Write a tiny README',   body: 'What is it, how do you run it, what made it weird. One paragraph minimum. One page maximum.' },
              { title: 'Push the submit button', body: 'Before 20 Jun 17:00 ET. The button will, at that exact moment, become unclickable.' },
            ].map((step, i) => (
              <li key={i} style={{
                padding: 26,
                border: '2px solid var(--ow-ink)',
                background: 'var(--ow-paper)',
              }}>
                <span className="ow-bignum" style={{
                  fontSize: '3rem',
                  color: 'var(--ow-red)',
                  lineHeight: 0.9,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{
                  fontSize: '1.25rem',
                  marginTop: 12,
                  textTransform: 'none',
                  fontWeight: 800,
                  letterSpacing: '-0.005em',
                }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', marginTop: 8 }}>{step.body}</p>
              </li>
            ))}
          </ol>

          <p style={{ marginTop: 24, fontSize: '0.8125rem' }}>
            Full submission requirements live in{' '}
            <Link href="/hackathon/rules#submissions" className="no-underline" style={{
              color: 'var(--ow-ink)',
              backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))',
              backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%',
            }}>rules · § submissions</Link>.
          </p>
        </div>

        <style>{`
          @media (max-width: 700px) {
            .ow-subopen { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  )
}

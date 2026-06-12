import Link from 'next/link'
import { Countdown } from '@/components/hackathon/Countdown'
import { VerifiedCounter } from '@/components/hackathon/VerifiedCounter'
import { WeirdMarquee } from '@/components/hackathon/WeirdMarquee'

/* ─────────────────────────────────────────────────────────────────────────
   small section helpers — kept local so the landing reads top-to-bottom
   ───────────────────────────────────────────────────────────────────────── */

function SectionMark({
  index,
  kicker,
  red = false,
}: { index: string; kicker: string; red?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 14,
        fontFamily: "'Big Shoulders Display', sans-serif",
        fontWeight: 800,
        fontSize: '0.875rem',
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: red ? 'var(--ow-red)' : 'var(--ow-ink)',
      }}
    >
      <span style={{
        display: 'inline-block',
        width: 56,
        height: 2,
        background: red ? 'var(--ow-red)' : 'var(--ow-ink)',
      }} />
      <span>§ {index}</span>
      <span style={{ color: 'var(--ow-ink-3)' }}>—</span>
      <span>{kicker}</span>
    </div>
  )
}

const COMMANDMENTS = [
  {
    n: '01',
    head: "Build the thing you'd never put on a resume.",
    body: 'No career signalling. No growth chart. The project that makes your friends laugh, your therapist tilt their head, and your future-self wince.',
  },
  {
    n: '02',
    head: 'Prove it ran (at least once).',
    body: 'Demos > slides. Screenshots > screenshots-of-Figma. One Loom of the artefact actually doing the thing. You may staple the loop together with prayer.',
  },
  {
    n: '03',
    head: 'Demo it to a stranger.',
    body: 'Live, on the 20th, to a real human who did not sign an NDA. If it survives explanation by a sleep-deprived founder, it ships into the verified-weird hall of fame.',
  },
]

const TIMELINE = [
  { n: '01', date: 'Thu · 18 Jun', time: '09:00 ET', head: 'Kickoff stream',     body: 'Theme reveal, sponsor toast, judges introduced. 48-hour clock starts.' },
  { n: '02', date: 'Thu → Sat',    time: 'Async',    head: 'Build window',       body: '48 hours. Ship something. Anything. Preferably weird.' },
  { n: '03', date: 'Fri · 19 Jun', time: '10:00 ET', head: 'Mid-build sync',     body: 'Live check-in stream. Show your scaffold, your first crime.' },
  { n: '04', date: 'Sat · 20 Jun', time: '09:00 ET', head: 'Submissions close',  body: 'The door is locked from the outside. 48 hours up.' },
  { n: '05', date: 'Sat · 20 Jun', time: '13:00 ET', head: 'Finalists announced', body: 'Eight (8) projects called up. Get to NYC if you can.' },
  { n: '06', date: 'Sat · 20 Jun', time: '17:00 ET', head: 'In-person finals',   body: 'An unmarked door in NYC. Demos. Judging. Trophies. Weeping.' },
]

const TRACKS = [
  {
    glyph: 'A',
    title: 'Useless Engineering',
    blurb: 'Projects that, when complete, leave the world precisely as broken as they found it.',
    examples: ['A printer that respects pronouns', 'A fitness tracker for tamagotchis', 'Thermal-paper RSS reader'],
  },
  {
    glyph: 'B',
    title: 'Cursed Technology',
    blurb: 'The build that disturbs you. The demo where the judge says "I hate that this works."',
    examples: ['Chess engine that resigns from shame', 'Auth via webcam vibe-check', 'Cron-job confessional'],
  },
  {
    glyph: 'C',
    title: 'Beautiful Trash',
    blurb: 'Taking the ugliest input the internet can provide and making it heart-stoppingly elegant.',
    examples: ['Terminal that responds in haiku', 'Oscilloscope visualising regret', 'CSS-only barometer'],
  },
  {
    glyph: 'D',
    title: 'Demo Theatre',
    blurb: 'Projects where the demo IS the project. Performance art with a deploy step.',
    examples: ['A one-shot easter egg in production', 'A vending machine that gives advice', 'Live-coded weather'],
  },
]

const RULES_PEEK = [
  'Solo builders welcome. Teams of up to four (4) humans.',
  'Build window opens 18 Jun 09:00 ET. Nothing made before that counts. 48 hours, hard.',
  'AI assistance: fine. AI submitted on its own behalf: not fine.',
  'No harassment. No harm. No shock-value-as-substance.',
  'Open source everything you ship (license your choice).',
  'One (1) Loom-style demo, three minutes max, mandatory.',
  'Finalists who want to present MUST be in NYC on 20 Jun. No remote demo backup.',
  "Judges' decisions are final. Unless funny — then extra-final.",
]

/* ─────────────────────────────────────────────────────────────────────────
   page
   ───────────────────────────────────────────────────────────────────────── */

export default function HackathonLanding() {
  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section style={{ paddingTop: 56, paddingBottom: 48, position: 'relative' }}>
        <div className="ow-container">
          {/* top eyebrow row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
            alignItems: 'center', gap: 16, marginBottom: 36,
          }}>
            <span className="ow-stamp ow-stamp-wobble">◆ Verified Weird</span>
            <span className="ow-label ow-label-mute">§ 00 — Edition One · One Weekend · One Door</span>
          </div>

          {/* huge wordmark */}
          <div
            className="ow-rise"
            style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.82,
              letterSpacing: '-0.045em',
              color: 'var(--ow-ink)',
              fontSize: 'clamp(3.5rem, 15vw, 12rem)',
            }}
          >
            <span style={{ display: 'block' }}>ONLYHACKS</span>
            <span style={{
              display: 'inline-block',
              color: 'var(--ow-red)',
              transform: 'translateY(-0.05em)',
            }}>’26.</span>
          </div>

          {/* strapline */}
          <div style={{
            marginTop: 14,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(1rem, 2.6vw, 1.625rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: 'var(--ow-ink-3)',
          }}>
            for the <span style={{ color: 'var(--ow-red)', fontWeight: 600 }}>onlyweird.</span>
          </div>

          {/* imprint line — co-host credit */}
          <div style={{
            marginTop: 12,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--ow-ink-2)',
          }}>
            Hosted by OnlyWorks <span style={{ color: 'var(--ow-red)' }}>×</span> Orbis
          </div>

          {/* fat rule */}
          <hr className="ow-rule-fat" style={{ marginTop: 20 }} />

          {/* tagline row + countdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: 56,
              marginTop: 28,
              alignItems: 'flex-start',
            }}
            className="ow-hero-grid"
          >
            <div>
              <p className="lede" style={{ maxWidth: 620 }}>
                An OnlyWorks hackathon for builders who would rather <span className="ow-ink-underline">ship the joke</span> than slide-deck the empire. <strong>48 hours</strong>, async, on your own machine. Then on June 20th the finalists walk through an unmarked door in NYC and demo to a room full of strangers. Finalists who want to present <strong>must</strong> be there in person.
              </p>

              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 12,
                marginTop: 28,
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 700, fontSize: '0.875rem',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--ow-ink)',
              }}>
                <span>Thu 18 — Sat 20 Jun ’26</span>
                <span style={{ color: 'var(--ow-ink-3)' }}>·</span>
                <span>48 hours async</span>
                <span style={{ color: 'var(--ow-ink-3)' }}>·</span>
                <span>In-person finals · NYC</span>
                <span style={{ color: 'var(--ow-ink-3)' }}>·</span>
                <span style={{ color: 'var(--ow-red)' }}>door reveal 20 Jun</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 36 }}>
                <Link href="/hackathon/register" className="ow-btn ow-btn-primary no-underline">
                  Register →
                </Link>
                <Link href="/hackathon/rules" className="ow-btn no-underline">
                  Read the rules
                </Link>
                <Link href="/hackathon/schedule" className="ow-btn ow-btn-ghost no-underline">
                  Full schedule
                </Link>
              </div>
            </div>

            <aside>
              <div className="ow-label ow-label-mute" style={{ marginBottom: 14 }}>
                Time to kickoff
              </div>
              <Countdown />
              <p style={{
                marginTop: 18,
                fontSize: '0.875rem', color: 'var(--ow-ink-2)',
                paddingTop: 14, borderTop: '1px solid var(--ow-ink)',
              }}>
                Anchored to <strong style={{ color: 'var(--ow-ink)' }}>18 Jun · 09:00 ET</strong>. Your local clock may drift; that is your problem and also a beautiful weakness.
              </p>
            </aside>
          </div>

          {/* counter row */}
          <div style={{ marginTop: 56 }}>
            <VerifiedCounter />
          </div>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .ow-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </section>

      {/* big squiggle break */}
      <div aria-hidden className="ow-squiggle" style={{ margin: '0 auto', maxWidth: 1480, padding: '0 24px' }} />

      {/* black marquee */}
      <WeirdMarquee />

      {/* ═══════════ §01 — three commandments ═══════════ */}
      <section className="ow-section">
        <div className="ow-container">
          <SectionMark index="01" kicker="Three Laws" />
          <h2 style={{ marginTop: 18, maxWidth: 11 + 'ch' }}>
            Three<br />weird laws.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              marginTop: 48,
            }}
          >
            {COMMANDMENTS.map(c => (
              <article key={c.n} className="ow-card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                  <span className="ow-bignum" style={{
                    fontSize: '4.5rem',
                    color: 'var(--ow-red)',
                    lineHeight: 0.9,
                  }}>
                    {c.n}
                  </span>
                  <span className="ow-label ow-label-mute">Law / {c.n}</span>
                </div>
                <hr className="ow-rule" style={{ marginBottom: 18 }} />
                <h3 style={{
                  fontSize: '1.5rem',
                  textTransform: 'none',
                  fontWeight: 800,
                  letterSpacing: '-0.012em',
                  lineHeight: 1.05,
                  marginBottom: 12,
                }}>
                  {c.head}
                </h3>
                <p style={{ fontSize: '0.9375rem' }}>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ §02 — manifesto + spec ═══════════ */}
      <section className="ow-section" style={{
        background: 'var(--ow-paper-warm)',
        borderTop: '1px solid var(--ow-ink)',
        borderBottom: '1px solid var(--ow-ink)',
      }}>
        <div className="ow-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <SectionMark index="02" kicker="Manifesto" />
              <h2 style={{ marginTop: 18, maxWidth: '14ch' }}>
                What <span style={{ color: 'var(--ow-red)' }}>is</span><br />this thing?
              </h2>
            </div>
            <span className="ow-stamp ow-stamp-tilt-r" style={{ marginTop: 18 }}>Typeset Ok</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
              gap: 56,
              alignItems: 'flex-start',
              marginTop: 48,
            }}
            className="ow-manifesto-grid"
          >
            <div>
              <p className="lede">
                Most hackathons want you to pitch a startup. ONLYHACKS for the ONLYWEIRD does not. ONLYHACKS for the ONLYWEIRD wants the project you&apos;ve been embarrassed to mention, the thing your Slack message starts with &ldquo;don&apos;t tell anyone but&rdquo;, the file in your repo called <em style={{ fontStyle: 'normal', color: 'var(--ow-red)' }}>brainworm_v3_DO_NOT_OPEN.py</em>.
              </p>
              <p style={{ marginTop: 22 }}>
                We want builds that are: technically real, narratively cursed, aesthetically committed, economically indefensible, and ten seconds long to explain at a bar. We want the version where the README is a poem and the install instructions involve a phrase like <em style={{ fontStyle: 'normal', color: 'var(--ow-ink)' }}>&ldquo;press until it whirrs&rdquo;</em>.
              </p>
              <p style={{ marginTop: 22 }}>
                ONLYHACKS for the ONLYWEIRD is hosted by <Link href="/" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>OnlyWorks</Link> — the platform for verified proof of real work. So naturally, we wanted to find out what happens when you point a verification engine at the worst possible kind of work, which is: delightful, useless, undeniably yours.
              </p>
              <p style={{ marginTop: 22 }}>
                Build something we&apos;d believe a human (you, specifically) made. Show us the receipts. Demo it to a stranger. That&apos;s the whole event.
              </p>
            </div>

            {/* SPEC CARD */}
            <aside
              style={{
                border: '2px solid var(--ow-ink)',
                background: 'var(--ow-paper)',
                padding: 28,
                boxShadow: '6px 6px 0 0 var(--ow-red)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                <span className="ow-label">Edition One</span>
                <span className="ow-label ow-label-red">№ 00026</span>
              </div>
              <hr className="ow-rule" style={{ marginBottom: 18 }} />

              {[
                ['Window',       <span key="w"><strong>18 Jun</strong> → <strong>20 Jun ’26</strong></span>],
                ['Format',       '48-hour build + in-person NYC finals'],
                ['Finals',       <span key="f">New York City — <span style={{ color: 'var(--ow-red)' }}>door reveal 20 Jun</span></span>],
                ['Team size',    '1 – 4 humans'],
                ['Cost',         '$0 to enter · Pro accounts comped'],
                ['Judges',       'Announced at kickoff'],
                ['Stream',       'Links at kickoff'],
                ['Presented by', 'OnlyWorks × Orbis'],
              ].map(([k, v], i, a) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '12px 0',
                    borderBottom: i === a.length - 1 ? 'none' : '1px solid var(--ow-ink)',
                    gap: 16,
                  }}
                >
                  <span className="ow-label ow-label-mute" style={{ minWidth: 120 }}>{k}</span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--ow-ink)', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </aside>
          </div>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .ow-manifesto-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════ §03 — the week ═══════════ */}
      <section className="ow-section">
        <div className="ow-container">
          <SectionMark index="03" kicker="The 48" />
          <h2 style={{ marginTop: 18 }}>
            48 hours.<br />
            <span style={{ color: 'var(--ow-red)' }}>One weird.</span>
          </h2>

          <div style={{ marginTop: 48, border: '2px solid var(--ow-ink)', boxShadow: '6px 6px 0 0 var(--ow-ink)', background: 'var(--ow-paper)' }}>
            {TIMELINE.map((row, i) => (
              <div
                key={row.n}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px minmax(160px, 200px) minmax(110px, 140px) 1fr',
                  gap: 24,
                  alignItems: 'baseline',
                  padding: '24px 28px',
                  borderBottom: i === TIMELINE.length - 1 ? 'none' : '1px solid var(--ow-ink)',
                  background: i === TIMELINE.length - 1 ? 'var(--ow-red-pale)' : 'transparent',
                }}
                className="ow-week-row"
              >
                <span className="ow-bignum" style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                  color: i === TIMELINE.length - 1 ? 'var(--ow-red)' : 'var(--ow-ink)',
                  lineHeight: 0.9,
                }}>
                  {row.n}
                </span>
                <span style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.125rem',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  color: 'var(--ow-ink)',
                }}>
                  {row.date}
                </span>
                <span className="ow-label ow-label-mute">{row.time}</span>
                <div>
                  <div style={{
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.375rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.01em',
                    color: 'var(--ow-ink)',
                  }}>{row.head}</div>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--ow-ink-2)', marginTop: 4 }}>
                    {row.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/hackathon/schedule" className="ow-btn ow-btn-ghost no-underline">
              Full schedule →
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 800px) {
            .ow-week-row { grid-template-columns: 1fr !important; gap: 6px !important; padding: 18px 20px !important; }
          }
        `}</style>
      </section>

      {/* red marquee */}
      <WeirdMarquee inverted />

      {/* ═══════════ §04 — tracks ═══════════ */}
      <section className="ow-section">
        <div className="ow-container">
          <SectionMark index="04" kicker="Categories" />
          <h2 style={{ marginTop: 18 }}>
            Four flavours<br />of weird.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
              marginTop: 48,
            }}
          >
            {TRACKS.map((t, i) => (
              <article key={t.title} className="ow-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 64, height: 64,
                      border: '2px solid var(--ow-ink)',
                      background: i % 2 === 0 ? 'var(--ow-ink)' : 'var(--ow-red)',
                      color: 'var(--ow-paper)',
                      fontFamily: "'Big Shoulders Display', sans-serif",
                      fontWeight: 900,
                      fontSize: '2rem',
                      lineHeight: 1,
                      transform: 'rotate(-3deg)',
                    }}
                  >
                    {t.glyph}
                  </span>
                  <span className="ow-label ow-label-mute">Track / {i + 1}</span>
                </div>

                <h3 style={{
                  fontSize: '1.5rem',
                  textTransform: 'none',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  marginTop: 8,
                }}>
                  {t.title}
                </h3>
                <p style={{ fontSize: '0.9375rem' }}>{t.blurb}</p>

                <hr className="ow-rule" style={{ marginTop: 4 }} />

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                  {t.examples.map(ex => (
                    <li key={ex} style={{
                      display: 'flex', gap: 8,
                      fontSize: '0.8125rem', color: 'var(--ow-ink-2)',
                      lineHeight: 1.5,
                    }}>
                      <span style={{ color: 'var(--ow-red)', fontWeight: 700 }}>›</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ §05 — prizes ═══════════ */}
      <section className="ow-section" style={{ background: 'var(--ow-ink)', color: 'var(--ow-paper)' }}>
        <div className="ow-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'baseline', gap: 14,
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 800,
                fontSize: '0.875rem', letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'var(--ow-paper)',
              }}>
                <span style={{ display: 'inline-block', width: 56, height: 2, background: 'var(--ow-paper)' }} />
                <span>§ 05</span>
                <span style={{ color: 'rgba(241,236,226,0.5)' }}>—</span>
                <span>Prize Tree</span>
              </div>
              <h2 style={{ marginTop: 18, color: 'var(--ow-paper)' }}>
                $500<br />
                <span style={{ color: 'var(--ow-red)' }}>+ the rest in access.</span>
              </h2>
            </div>
            <span className="ow-stamp ow-stamp-tilt-l" style={{ borderColor: 'var(--ow-paper)', color: 'var(--ow-paper)' }}>Access &gt; cash</span>
          </div>

          {/* honest pitch line — sets expectations before the tree */}
          <p
            className="lede"
            style={{
              color: 'var(--ow-paper)',
              maxWidth: 820,
              marginTop: 28,
              borderLeft: '3px solid var(--ow-red)',
              paddingLeft: 18,
            }}
          >
            $500 cash, lifetime OnlyWorks Pro, 1:1 time with the judges, a permanent feature, and a trophy you&apos;ll keep on your desk. That&apos;s the grand prize — announced end of July. Below, the full tree — including this year&apos;s judge-named awards.
          </p>

          {/* GRAND PRIZE — big editorial block */}
          <article
            style={{
              marginTop: 48,
              border: '2px solid var(--ow-paper)',
              padding: 40,
              background: 'transparent',
              position: 'relative',
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
              gap: 36,
              alignItems: 'center',
            }}
              className="ow-prize-grand"
            >
              <div>
                <div className="ow-label" style={{ color: 'rgba(241,236,226,0.6)' }}>Grand prize</div>
                <div style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 2vw, 2rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  marginTop: 6,
                  color: 'var(--ow-paper)',
                }}>
                  Verified Weird
                </div>
                <div className="ow-bignum" style={{
                  fontSize: 'clamp(4rem, 12vw, 9rem)',
                  color: 'var(--ow-red)',
                  marginTop: 14,
                  lineHeight: 0.9,
                }}>
                  $500.
                </div>
                <div style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 700, fontSize: '0.8125rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  marginTop: 8,
                  color: 'rgba(241,236,226,0.7)',
                }}>
                  Announced end of July. Plus everything below — and the most embarrassing trophy we could afford to make.
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {[
                  'OnlyWorks Pro · lifetime',
                  'Mentorship from the judging panel · details confirmed at kickoff',
                  'Feature on OnlyWorks.com homepage',
                  'Permanent "Verified Weird ’26" badge on your OnlyWorks profile',
                  'Trophy: a literal rubber duck on a plinth',
                  'OnlyWorks-branded merch drop (delivered worldwide)',
                ].map(x => (
                  <li key={x} style={{
                    display: 'flex', gap: 14, alignItems: 'baseline',
                    paddingBottom: 12,
                    borderBottom: '1px solid rgba(241,236,226,0.2)',
                  }}>
                    <span className="ow-bignum" style={{ color: 'var(--ow-red)', fontSize: '1.125rem' }}>◆</span>
                    <span style={{ color: 'var(--ow-paper)', fontSize: '1rem' }}>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* track prizes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginTop: 20,
          }}>
            {[
              ['Most Useless',   'A single working LED'],
              ['Most Cursed',    "A rotary phone that doesn't ring"],
              ['Most Beautiful', 'A single perfect rock'],
            ].map(([label, trophy]) => (
              <article key={label} style={{ border: '2px solid var(--ow-paper)', padding: 24, background: 'transparent' }}>
                <div className="ow-label" style={{ color: 'rgba(241,236,226,0.6)' }}>Track prize</div>
                <div style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 900, fontSize: '1.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.02em',
                  marginTop: 4, color: 'var(--ow-paper)',
                }}>{label}</div>
                <div className="ow-bignum" style={{
                  fontSize: '2.25rem', color: 'var(--ow-red)',
                  marginTop: 10, lineHeight: 1,
                }}>The Goods.</div>
                <ul style={{
                  listStyle: 'none', padding: 0,
                  marginTop: 14, paddingTop: 12,
                  borderTop: '1px solid rgba(241,236,226,0.2)',
                  fontSize: '0.8125rem', color: 'rgba(241,236,226,0.78)',
                  display: 'grid', gap: 4,
                }}>
                  <li>+ OnlyWorks Pro · 2yr</li>
                  <li>+ Mentorship intro from a panel judge</li>
                  <li>+ Permanent Hall of Weird placement</li>
                  <li>+ Trophy: {trophy}</li>
                </ul>
              </article>
            ))}
          </div>

          {/* secondary prizes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            marginTop: 16,
          }}>
            {[
              ["People's Choice",   'Crowd-voted · the audience’s favourite weird build', ['OnlyWorks Pro · 1yr', 'Full newsletter spotlight (interview)', 'Swag pack', 'Trophy: a half-eaten sticker']],
              ['Honourable Mention', 'For the builds that earned a knowing nod from the panel', ['OnlyWorks Pro · 1yr', 'A sticker. Just the one.']],
            ].map(([label, blurb, perks]) => (
              <article key={label as string} style={{ border: '1px dashed rgba(241,236,226,0.45)', padding: 22, background: 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="ow-label" style={{ color: 'rgba(241,236,226,0.6)' }}>Secondary</div>
                </div>
                <div style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 900, fontSize: '1.375rem',
                  textTransform: 'uppercase', letterSpacing: '0.02em',
                  marginTop: 4, color: 'var(--ow-paper)',
                }}>{label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(241,236,226,0.7)', marginTop: 8, lineHeight: 1.5 }}>
                  {blurb}
                </div>
                <ul style={{
                  listStyle: 'none', padding: 0,
                  marginTop: 12, paddingTop: 10,
                  borderTop: '1px solid rgba(241,236,226,0.15)',
                  fontSize: '0.8125rem', color: 'rgba(241,236,226,0.78)',
                  display: 'grid', gap: 4,
                }}>
                  {(perks as string[]).map(p => <li key={p}>+ {p}</li>)}
                </ul>
              </article>
            ))}
          </div>

          {/* judge-named awards placeholder + cert link */}
          <div
            style={{
              marginTop: 32,
              border: '1px dashed rgba(241,236,226,0.45)',
              padding: 22,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 22,
              alignItems: 'center',
            }}
            className="ow-prize-extras"
          >
            <div>
              <div className="ow-label" style={{ color: 'rgba(241,236,226,0.6)' }}>Also coming</div>
              <div style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 900, fontSize: '1.375rem',
                textTransform: 'uppercase', letterSpacing: '0.02em',
                color: 'var(--ow-paper)', marginTop: 6,
              }}>
                Judge-named awards · <span style={{ color: 'var(--ow-red)' }}>certificate + mentorship</span>
              </div>
              <p style={{
                color: 'rgba(241,236,226,0.78)', fontSize: '0.9375rem',
                marginTop: 8, maxWidth: 640,
              }}>
                Each guest judge sponsors a named award — &ldquo;The [Judge] Award for [their pick of weirdness].&rdquo; No cash attached: winners receive a signed certificate and the mentorship slot that comes with it. Names + categories announced at kickoff.
              </p>
            </div>
            <Link
              href="/hackathon/certificate"
              className="ow-btn ow-btn-ghost no-underline"
              style={{ borderColor: 'var(--ow-paper)', color: 'var(--ow-paper)' }}
            >
              See a sample cert →
            </Link>
          </div>

          <p style={{
            marginTop: 28, fontSize: '0.75rem',
            color: 'rgba(241,236,226,0.45)',
            textAlign: 'center',
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>
            * Grand prize winner announced end of July; cash paid in USD via Stripe within 30 days of the announcement. Trophies hand-delivered or hand-mailed. Mentorship sessions scheduled by the OnlyWorks team in the two weeks after finals.
          </p>
        </div>

        <style>{`
          @media (max-width: 800px) {
            .ow-prize-grand { grid-template-columns: 1fr !important; gap: 20px !important; }
            .ow-prize-extras { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════ §06 — rules tldr ═══════════ */}
      <section className="ow-section">
        <div className="ow-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.6fr)',
              gap: 56,
              alignItems: 'flex-start',
            }}
            className="ow-rules-grid"
          >
            <div>
              <SectionMark index="06" kicker="Rules · TLDR" />
              <h2 style={{ marginTop: 18 }}>
                Eight<br />short<br />
                <span style={{ color: 'var(--ow-red)' }}>rules.</span>
              </h2>
              <p style={{ marginTop: 18, maxWidth: 360 }}>
                The long version is at <Link href="/hackathon/rules" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>/rules</Link>. The short version fits in a tweet, if tweets still exist by then.
              </p>
              <Link href="/hackathon/rules" className="ow-btn ow-btn-ghost no-underline" style={{ marginTop: 28 }}>
                Full rules + FAQ →
              </Link>
            </div>

            <ol style={{
              listStyle: 'none', padding: 0, margin: 0,
              border: '2px solid var(--ow-ink)',
              background: 'var(--ow-paper)',
              boxShadow: '6px 6px 0 0 var(--ow-ink)',
            }}>
              {RULES_PEEK.map((r, i) => (
                <li key={i} style={{
                  display: 'grid', gridTemplateColumns: '64px 1fr',
                  alignItems: 'center', padding: '18px 22px',
                  borderBottom: i === RULES_PEEK.length - 1 ? 'none' : '1px solid var(--ow-ink)',
                  fontSize: '1rem',
                  background: i % 2 === 0 ? 'transparent' : 'var(--ow-paper-warm)',
                  color: 'var(--ow-ink)',
                }}>
                  <span className="ow-bignum" style={{
                    fontSize: '1.75rem',
                    color: 'var(--ow-red)',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <style>{`
          @media (max-width: 800px) {
            .ow-rules-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════ §07 — sponsors ═══════════ */}
      <section className="ow-section-sm" style={{ borderTop: '2px solid var(--ow-ink)', borderBottom: '2px solid var(--ow-ink)', background: 'var(--ow-paper-warm)' }}>
        <div className="ow-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <SectionMark index="07" kicker="Sponsors" />
            <span className="ow-label ow-label-mute">Become one — weird@only-works.com</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
            }}
          >
            {[
              { role: 'Presented by', name: 'OnlyWorks', placeholder: false, feature: true },
              { role: 'Co-hosted by', name: 'Orbis', placeholder: false, feature: true },
              { role: 'Platinum',     name: '[ your logo ]', placeholder: true },
              { role: 'Gold',         name: '[ your logo ]', placeholder: true },
              { role: 'Silver',       name: '[ your logo ]', placeholder: true },
              { role: 'Silver',       name: '[ your logo ]', placeholder: true },
              { role: 'In-kind',      name: '[ your logo ]', placeholder: true },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  border: s.placeholder ? '1px dashed var(--ow-ink-3)' : '2px solid var(--ow-ink)',
                  background: s.feature ? 'var(--ow-ink)' : 'var(--ow-paper)',
                  color: s.feature ? 'var(--ow-paper)' : 'var(--ow-ink)',
                  padding: '28px 18px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  gridColumn: i === 0 ? 'span 2' : 'span 1',
                  minHeight: 110,
                }}
                className={i === 0 ? 'ow-sponsor-feature' : undefined}
              >
                <div style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: s.feature ? 'rgba(241,236,226,0.55)' : 'var(--ow-ink-3)',
                  marginBottom: 6,
                }}>{s.role}</div>
                <div style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 900,
                  fontSize: i === 0 ? '2.5rem' : '1.125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  lineHeight: 0.95,
                  color: s.placeholder ? 'var(--ow-ink-3)' : (s.feature ? 'var(--ow-paper)' : 'var(--ow-ink)'),
                }}>
                  {s.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 700px) {
            .ow-sponsor-feature { grid-column: span 1 !important; }
          }
        `}</style>
      </section>

      {/* ═══════════ §08 — final CTA ═══════════ */}
      <section style={{ padding: '120px 0', background: 'var(--ow-paper)' }}>
        <div className="ow-container" style={{ textAlign: 'center', position: 'relative' }}>
          <span className="ow-stamp ow-stamp-tilt-r" style={{ marginBottom: 18, display: 'inline-block' }}>
            ◆ Last call
          </span>
          <h2 style={{
            fontSize: 'clamp(3rem, 11vw, 10rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.035em',
          }}>
            Ready to be<br />
            <span style={{ color: 'var(--ow-red)' }}>verified weird?</span>
          </h2>
          <p className="lede" style={{ maxWidth: 580, margin: '32px auto 0' }}>
            Registration is one form, one minute, zero cost. You can drop out the moment things get uncomfortable. You will not. We&apos;ll see you on the 18th.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 36 }}>
            <Link href="/hackathon/register" className="ow-btn ow-btn-primary no-underline" style={{ padding: '20px 28px', fontSize: '0.9375rem' }}>
              Register →
            </Link>
            <Link href="/hackathon/projects" className="ow-btn no-underline" style={{ padding: '20px 28px', fontSize: '0.9375rem' }}>
              Browse the wall
            </Link>
          </div>

          <hr className="ow-rule" style={{ marginTop: 64 }} />
          <div style={{ marginTop: 24, color: 'var(--ow-ink-3)' }}>
            <span className="ow-label ow-label-mute">Time to kickoff </span>
            <span className="ow-serial" style={{ color: 'var(--ow-ink)', fontSize: '1.125rem' }}>
              <Countdown compact />
            </span>
          </div>
        </div>
      </section>
    </>
  )
}

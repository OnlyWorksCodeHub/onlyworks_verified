import Link from 'next/link'

interface Section {
  id: string
  label: string
  title: string
  rules: { n: string; text: React.ReactNode }[]
}

const SECTIONS: Section[] = [
  {
    id: 'eligibility',
    label: 'Eligibility',
    title: 'Who can enter',
    rules: [
      { n: 'E.01', text: 'Must be 18+ on 18 Jun 2026.' },
      { n: 'E.02', text: 'Must be located in a jurisdiction where this kind of nonsense is legal. (It is, in most.)' },
      { n: 'E.03', text: 'Employees of OnlyWorks, our judges, and our sponsors may enter but are ineligible for cash prizes.' },
      { n: 'E.04', text: 'One (1) registration per human. No aliasing. Teams of up to four (4) humans permitted.' },
      { n: 'E.05', text: 'International finalists are responsible for their own visas and passports. We can write an invitation letter — email weird@only-works.com.' },
    ],
  },
  {
    id: 'window',
    label: 'Build window',
    title: 'When work counts',
    rules: [
      { n: 'W.01', text: <>Build window opens at <strong>18 Jun 2026 · 09:00 ET</strong>. Anything committed before that timestamp does not count. 48 hours total — clock does not stop for sleep.</> },
      { n: 'W.02', text: <>Submissions <em style={{ fontStyle: 'normal', color: 'var(--ow-red)' }}>open</em> at 19 Jun · 17:00 ET. You may keep building after this; you may also publish early to lock in.</> },
      { n: 'W.03', text: <>Submissions <em style={{ fontStyle: 'normal', color: 'var(--ow-red)' }}>soft-close</em> at 20 Jun · 08:30 ET. You can keep editing your README after this. Nothing else.</> },
      { n: 'W.04', text: <>Submissions <em style={{ fontStyle: 'normal', color: 'var(--ow-red)' }}>hard-close</em> at 20 Jun · 09:00 ET. The submit button stops working. The door, as they say, is locked from the outside.</> },
      { n: 'W.05', text: 'Previously-built side projects are not eligible. Previously-failed side projects you are reviving from the grave — eligible if the resurrection produces ≥ 80% new work.' },
      { n: 'W.06', text: "Pre-existing libraries, frameworks, open-source dependencies — all fine. That's not your project; it's gravity." },
    ],
  },
  {
    id: 'ai',
    label: 'AI usage',
    title: 'About your robot co-author',
    rules: [
      { n: 'A.01', text: 'AI assistance is allowed and encouraged. Use Claude, Codex, Copilot, an evil oracle made of dice, whatever helps.' },
      { n: 'A.02', text: <>AI as <em style={{ fontStyle: 'normal', color: 'var(--ow-ink)' }}>collaborator</em> = good. AI as <em style={{ fontStyle: 'normal', color: 'var(--ow-red)' }}>sole author</em> = ineligible. You must be able to explain your project, in person at the NYC finals, without it.</> },
      { n: 'A.03', text: 'Projects whose entire premise is "what if an LLM did the thing" are eligible only in the Cursed and Theatre tracks.' },
      { n: 'A.04', text: 'Disclose AI usage in your README. One short paragraph. Judges enjoy honesty more than they enjoy purity.' },
      { n: 'A.05', text: 'We will not run AI detectors on your code. We trust you. We will, however, ask you to explain it.' },
    ],
  },
  {
    id: 'submissions',
    label: 'Submissions',
    title: 'What you must ship',
    rules: [
      { n: 'S.01', text: <>One (1) Loom-style demo, <strong style={{ color: 'var(--ow-red)' }}>≤ 3 minutes</strong>. Show the artefact running. One-take preferred but not required.</> },
      { n: 'S.02', text: 'One (1) public repository or hosted artefact. Open source license of your choice (or none, if your project is "demo theatre").' },
      { n: 'S.03', text: <>One (1) README with: what is this, how to run it, what made it weird. <span style={{ color: 'var(--ow-ink-3)' }}>~ 200–600 words.</span></> },
      { n: 'S.04', text: 'Category tag: pick one. You can change it once before submissions close. Cross-category not allowed — pick the track that best describes you, even if it hurts.' },
      { n: 'S.05', text: 'OnlyWorks verification hook installed and signed before submission. One-line install — see the docs in your dashboard.' },
      { n: 'S.06', text: 'Optional: one (1) screenshot for the hall of weird grid. Recommended 1600×900. ASCII art accepted.' },
    ],
  },
  {
    id: 'judging',
    label: 'Judging',
    title: 'How we decide',
    rules: [
      { n: 'J.01', text: <>Five (5) judges: three from OnlyWorks, two guest judges. Judges remain anonymous until 19 Jun · 09:00 ET. <span style={{ color: 'var(--ow-ink-3)' }}>(Builds suspense. Also discourages bribery.)</span></> },
      { n: 'J.02', text: 'Judging happens in two rounds: (1) async over the Loom + repo; (2) in-person demo at the NYC finals for the eight (8) finalists. Finalists who want to present MUST attend in person — no remote demo backup.' },
      { n: 'J.03', text: 'Rubric (out of 100): committed weirdness (35), craft (25), demoability (20), narrative (10), surprise (10). The rubric is a guide. The rubric does not vote.' },
      { n: 'J.04', text: 'Judges may dock points for: shock-value-as-substance, copying a previous ONLYHACKS for the ONLYWEIRD project, projects that punch down, or projects whose only weird is "I used an LLM".' },
      { n: 'J.05', text: "People's Choice is decided by public vote on submissions during the day of finals. One vote per Discord-verified attendee. Ballot stuffing is detected, mocked, and discarded." },
      { n: 'J.06', text: "Judges' decisions are final. And, occasionally, dramatic. They will not be re-litigated in public." },
    ],
  },
  {
    id: 'conduct',
    label: 'Conduct & venue',
    title: 'How to be a person',
    rules: [
      { n: 'C.01', text: 'No harassment of any kind. No slurs, no targeted abuse, no "ironic" cruelty. This includes chat, DMs, demos, and the NYC venue.' },
      { n: 'C.02', text: 'No shock-value-as-substance: gratuitous gore, fake violence, sexual content, self-harm content. Weird is one thing; ugly is another.' },
      { n: 'C.03', text: 'Projects that target individuals, harass real people, scrape private data, or deepfake identifiable humans are ineligible.' },
      { n: 'C.04', text: 'Discord is moderated. Moderators are friendly. They will also boot you, swiftly and without ceremony, for any of the above.' },
      { n: 'C.05', text: 'Finals venue is a private NYC space provided by an undisclosed sponsor. Address shared with finalists at 09:00 ET on 20 Jun. Attendance is by RSVP only.' },
      { n: 'C.06', text: 'The venue is sober-friendly. There is a bar (after demos). There is also seltzer. Nobody will pressure you either way.' },
      { n: 'C.07', text: 'Venue is wheelchair-accessible. Captioning is available on request — tell us in your registration form.' },
    ],
  },
  {
    id: 'ip',
    label: 'Ownership',
    title: 'Who owns what',
    rules: [
      { n: 'O.01', text: 'You own your project. Always. Fully. Forever.' },
      { n: 'O.02', text: 'By submitting, you grant OnlyWorks a non-exclusive license to display your project (title, blurb, Loom, screenshots) on the ONLYHACKS for the ONLYWEIRD Hall of Weird, our newsletter, and our social channels.' },
      { n: 'O.03', text: 'You can request removal of your project from the Hall of Weird at any time. We will honour that within 7 days.' },
      { n: 'O.04', text: 'OnlyWorks verification metadata about your project is owned by you, not by OnlyWorks. You may take it with you.' },
      { n: 'O.05', text: 'Sponsor prizes (cash, OW Pro accounts) are awarded directly to the winner with no IP exchange. Sponsors do not get to own a piece of your project.' },
    ],
  },
  {
    id: 'misc',
    label: 'Misc',
    title: 'Edge cases',
    rules: [
      { n: 'M.01', text: "This hackathon is run with reasonable best effort by a small team of humans. Anything we got wrong, email weird@only-works.com and we'll make it right." },
      { n: 'M.02', text: 'Rules may be amended before the build window opens. Material amendments will be announced in Discord, on the schedule page, and via email.' },
      { n: 'M.03', text: 'After the build window opens, only minor clarifications will be made — no new restrictions, no removal of existing tracks.' },
      { n: 'M.04', text: 'There is no entry fee. There is also no refund mechanism. This is not a meaningful sentence but the lawyer enjoyed it.' },
      { n: 'M.05', text: <>If you are reading this <em style={{ fontStyle: 'normal', color: 'var(--ow-ink)' }}>just to find a loophole</em>, you have found the one loophole that disqualifies you. <span style={{ color: 'var(--ow-ink-3)' }}>Kidding. Mostly.</span></> },
    ],
  },
]

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: 'How much does it cost to enter?',
    a: "Zero dollars to enter. We cover Discord, video hosting, OW Pro for attendees, and the NYC venue. Travel and lodging for the NYC finals are on you — we keep a small emergency travel fund if you absolutely can't otherwise make it. Email weird@only-works.com.",
  },
  {
    q: 'Can I enter from outside the US?',
    a: 'Yes for the build window (entirely async, run from wherever you live). But the finals are in person in NYC. If you want to present and win, you must be physically present in NYC on 20 Jun. No remote demo backup.',
  },
  {
    q: 'Do I need an OnlyWorks account?',
    a: <>Yes — required. The account is free, but you must (1) sign up at <Link href="/" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>OnlyWorks.com</Link>, (2) download the desktop app, and (3) put your OW ID into the registration form. The registration form will reject submissions without a valid OW ID. OnlyWorks is the platform we use to verify your build belongs to you.</>,
  },
  {
    q: 'What counts as "weird"?',
    a: "We deliberately won't define it. The three commandments + the four tracks should give you a feel. When in doubt: would you proudly put this on LinkedIn? If yes, this is not the hackathon for it.",
  },
  {
    q: 'Can I build hardware?',
    a: 'Absolutely. Hardware projects must include a clear-enough demo video that judges can verify functionality remotely. If the rig is the size of a couch, please film it.',
  },
  {
    q: 'Can my project be a single tweet / a website / a movie?',
    a: 'As long as it required real building, yes. A static .mp4 with no code behind it is not eligible. A 4kb websocket art toy is.',
  },
  {
    q: 'What if I drop out halfway?',
    a: 'No penalty. You keep your OW Pro account, your Discord invite, and our affection. Please email so we can free up your finals slot for someone on the waitlist.',
  },
  {
    q: 'Will there be a waitlist?',
    a: 'Yes, once registrations exceed 512. Waitlist movement happens daily, and we always email before clearing slots.',
  },
  {
    q: 'Do you have a code of conduct?',
    a: <>Section §C above is our code of conduct in summarised form. The long-form version lives on the <Link href="/" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>main OnlyWorks site</Link> and applies equally here.</>,
  },
  {
    q: 'Can I sponsor this thing?',
    a: <>Yes please. Email <a href="mailto:weird@only-works.com" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>weird@only-works.com</a> with subject &ldquo;sponsor&rdquo;. Tiers, perks, and weirdness levels available on request.</>,
  },
]

export default function RulesPage() {
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
            <span className="ow-stamp ow-stamp-tilt-r">Rules v1 · Effective 2026-06-01</span>
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
            Rules.<wbr /><span style={{ color: 'var(--ow-red)' }}>md</span>
          </h1>

          <hr className="ow-rule-fat" style={{ marginTop: 8 }} />

          <p className="lede" style={{ marginTop: 24, maxWidth: 660 }}>
            Short rules; long FAQ. Read both before registering if you want; read neither if you don&apos;t. The only one that genuinely matters is <Link href="#conduct" className="no-underline" style={{ color: 'var(--ow-red)', backgroundImage: 'linear-gradient(var(--ow-red), var(--ow-red))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>§conduct</Link>.
          </p>

          {/* table of contents */}
          <nav
            aria-label="Rules sections"
            style={{
              marginTop: 36,
              border: '2px solid var(--ow-ink)',
              padding: 22,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 8,
              background: 'var(--ow-paper)',
            }}
          >
            {SECTIONS.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="no-underline ow-toc-link"
              >
                <span style={{
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 800, fontSize: '0.875rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  § {String(i + 1).padStart(2, '0')} · {s.label}
                </span>
                <span className="ow-label ow-label-mute">{String(s.rules.length).padStart(2, '0')}</span>
              </a>
            ))}
            <a
              href="#faq"
              className="no-underline"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                padding: '8px 10px',
                background: 'var(--ow-red)',
                color: 'var(--ow-paper)',
                gridColumn: '1 / -1',
                marginTop: 4,
              }}
            >
              <span style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 900, fontSize: '0.875rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>
                § FAQ · Frequently questioned weirdness
              </span>
              <span style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 800, fontSize: '0.6875rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(241,236,226,0.7)',
              }}>{String(FAQ.length).padStart(2, '0')}</span>
            </a>
          </nav>
        </div>
      </section>

      {/* sections */}
      <section style={{ paddingBottom: 80 }}>
        <div className="ow-container" style={{ display: 'grid', gap: 56 }}>
          {SECTIONS.map((s, idx) => (
            <article key={s.id} id={s.id} style={{ scrollMarginTop: 120 }}>
              <header style={{ marginBottom: 22 }}>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
                  alignItems: 'baseline', gap: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                    <span className="ow-bignum" style={{
                      fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                      color: 'var(--ow-red)',
                      lineHeight: 0.9,
                    }}>
                      §{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
                      {s.title}
                    </h2>
                  </div>
                  <span className="ow-label ow-label-mute">{s.label}</span>
                </div>
                <hr className="ow-rule" style={{ marginTop: 14 }} />
              </header>

              <ol style={{
                listStyle: 'none', padding: 0, margin: 0,
                border: '2px solid var(--ow-ink)',
                background: 'var(--ow-paper)',
                boxShadow: '5px 5px 0 0 var(--ow-ink)',
              }}>
                {s.rules.map((r, i) => (
                  <li key={r.n} style={{
                    display: 'grid', gridTemplateColumns: '100px 1fr',
                    gap: 18, padding: '16px 22px',
                    borderBottom: i === s.rules.length - 1 ? 'none' : '1px solid var(--ow-ink)',
                    fontSize: '1rem', lineHeight: 1.55,
                    background: i % 2 === 0 ? 'transparent' : 'var(--ow-paper-warm)',
                  }}>
                    <span className="ow-bignum" style={{
                      color: 'var(--ow-ink)',
                      fontSize: '1rem',
                      letterSpacing: '0.04em',
                    }}>
                      {r.n}
                    </span>
                    <span style={{ color: 'var(--ow-ink)' }}>{r.text}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        paddingTop: 80, paddingBottom: 96,
        background: 'var(--ow-paper-warm)',
        borderTop: '2px solid var(--ow-ink)',
      }} id="faq">
        <div className="ow-container">
          <header style={{ marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 14,
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 800, fontSize: '0.875rem',
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'var(--ow-red)',
            }}>
              <span style={{ display: 'inline-block', width: 56, height: 2, background: 'var(--ow-red)' }} />
              <span>§ FAQ</span>
              <span style={{ color: 'var(--ow-ink-3)' }}>—</span>
              <span style={{ color: 'var(--ow-ink)' }}>Frequently questioned weirdness</span>
            </div>
            <h2 style={{ marginTop: 18 }}>
              You asked, mostly in<br />
              <span style={{ color: 'var(--ow-red)' }}>good faith.</span>
            </h2>
          </header>

          <div style={{ display: 'grid', gap: 14 }}>
            {FAQ.map((f, i) => (
              <details
                key={i}
                style={{
                  border: '2px solid var(--ow-ink)',
                  background: 'var(--ow-paper)',
                }}
              >
                <summary
                  style={{
                    listStyle: 'none', cursor: 'pointer',
                    padding: '20px 24px',
                    display: 'grid',
                    gridTemplateColumns: '72px 1fr 24px',
                    alignItems: 'center',
                    gap: 18,
                  }}
                >
                  <span className="ow-bignum" style={{
                    fontSize: '1.5rem',
                    color: 'var(--ow-red)',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontWeight: 800, fontSize: '1.125rem',
                    color: 'var(--ow-ink)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.005em',
                    lineHeight: 1.2,
                  }}>
                    {f.q}
                  </span>
                  <span aria-hidden style={{
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontWeight: 900, fontSize: '1.75rem',
                    color: 'var(--ow-ink)',
                    lineHeight: 0.7,
                    transition: 'transform 0.18s, color 0.18s',
                    textAlign: 'right',
                  }}>+</span>
                </summary>
                <div style={{
                  padding: '0 24px 22px 110px',
                  borderTop: '1px solid var(--ow-ink)',
                  paddingTop: 18,
                  fontSize: '0.9375rem',
                  color: 'var(--ow-ink-2)',
                  lineHeight: 1.6,
                }}>
                  {f.a}
                </div>
              </details>
            ))}
          </div>

          <div
            style={{
              marginTop: 56,
              border: '2px solid var(--ow-ink)',
              background: 'var(--ow-ink)',
              color: 'var(--ow-paper)',
              padding: 28,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div>
              <div className="ow-label" style={{ color: 'rgba(241,236,226,0.55)' }}>Still confused</div>
              <p style={{ marginTop: 4, fontSize: '1rem', color: 'var(--ow-paper)' }}>
                Email <a href="mailto:weird@only-works.com" className="no-underline" style={{ color: 'var(--ow-red)', backgroundImage: 'linear-gradient(var(--ow-red), var(--ow-red))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>weird@only-works.com</a>. We answer within 24h, often faster, occasionally in haiku.
              </p>
            </div>
            <Link href="/hackathon/register" className="ow-btn ow-btn-primary no-underline">
              Register →
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        details[open] summary span[aria-hidden] { transform: rotate(45deg); color: var(--ow-red); }
        details summary::-webkit-details-marker { display: none; }
      `}</style>
    </>
  )
}

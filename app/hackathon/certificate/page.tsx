'use client'

import Link from 'next/link'

/* ─────────────────────────────────────────────────────────────────────
   Sample certificate wireframe.
   - Real artefact (not just a sketch) so we can iterate visually.
   - Print-friendly: @media print hides chrome and shows only the cert.
   - Demonstrates the OnlyWorks verification flow (QR + hash + URL) since
     the cert is the conversion surface: any holder can be verified by
     visiting only-works.com/verify/<hash>, which is the wedge that pulls
     non-OW users into the OW product.
   ───────────────────────────────────────────────────────────────────── */

const SAMPLE = {
  recipient:   'REN M. ORTEGA',
  project:     'KETTLE.SH',
  blurb:       'A bash script that boils water by curling a smart kettle.',
  award:       'The [Guest Judge] Award for Cursed Elegance',
  judge:       '[Guest Judge]',
  category:    'Cursed Technology',
  date:        '20 JUNE 2026',
  location:    'The Internet · ◌',
  serial:      'OW-WEIRD-3F2A',
  hash:        '[hash]',
  verifyUrl:   'only-works.com/verify/[hash]',
}

/* Fake QR — a checkered SVG, not a real code. Wireframe only.
   When we ship for real, replace with a generated QR (e.g. qrcode lib)
   that encodes the verify URL. */
function FakeQR({ size = 132 }: { size?: number }) {
  const cells = 21
  // deterministic noise so it doesn't reflow on every render
  const dot = (x: number, y: number) => ((x * 31 + y * 17 + (x ^ y) * 7) % 5) < 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} role="img" aria-label="Verification QR (sample)">
      <rect width={cells} height={cells} fill="#1c1b18" />
      {Array.from({ length: cells }, (_, y) =>
        Array.from({ length: cells }, (_, x) =>
          dot(x, y) ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#f1ece2" /> : null
        )
      )}
      {/* three corner anchors */}
      {[[0, 0], [cells - 7, 0], [0, cells - 7]].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx} y={cy} width="7" height="7" fill="#1c1b18" />
          <rect x={cx + 1} y={cy + 1} width="5" height="5" fill="#f1ece2" />
          <rect x={cx + 2} y={cy + 2} width="3" height="3" fill="#1c1b18" />
        </g>
      ))}
    </svg>
  )
}

export default function CertificatePage() {
  return (
    <>
      {/* page chrome (hidden in print) */}
      <section className="cert-chrome" style={{ paddingTop: 56, paddingBottom: 24 }}>
        <div className="ow-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
            <Link href="/hackathon" className="no-underline" style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'var(--ow-ink-3)',
            }}>↩ Index</Link>
            <span className="ow-stamp ow-stamp-tilt-l">◆ Sample · not yours yet</span>
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
            Your<br />
            <span style={{ color: 'var(--ow-red)' }}>certificate.</span>
          </h1>

          <hr className="ow-rule-fat" style={{ marginTop: 8 }} />

          <p className="lede" style={{ marginTop: 24, maxWidth: 720 }}>
            Every ONLYHACKS for the ONLYWEIRD &apos;26 finalist gets a verifiable digital certificate, signed by OnlyWorks. Below is the sample — same layout, your name. The QR resolves to <strong style={{ color: 'var(--ow-ink)' }}>only-works.com/verify/&lt;hash&gt;</strong>, which proves the cert is real and that the project ran on your machine, on your hands, in the build window.
          </p>

          <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <Link href="/hackathon/register" className="ow-btn ow-btn-primary no-underline">
              Earn one yourself →
            </Link>
            <PrintButton />
            <Link href="/" className="ow-btn ow-btn-ghost no-underline">
              How OnlyWorks verifies
            </Link>
          </div>
        </div>
      </section>

      {/* The certificate itself */}
      <section className="cert-stage" style={{ padding: '32px 0 80px' }}>
        <div className="ow-container">
          <div className="cert-frame">
            <article className="cert" aria-label="Sample ONLYHACKS for the ONLYWEIRD '26 certificate">
              {/* top strip */}
              <header className="cert-top">
                <div className="cert-top-l">
                  <div className="cert-top-mark">ONLYHACKS for the ONLYWEIRD &apos;26</div>
                  <div className="cert-top-sub">Issue Nº 00026 · 24 hours, one weird.</div>
                </div>
                <div className="cert-top-r">
                  <div className="cert-top-mark" style={{ color: 'var(--ow-red)' }}>◆ Verified Weird</div>
                  <div className="cert-top-sub">Signed by OnlyWorks · only-works.com</div>
                </div>
              </header>

              <div className="cert-body">
                {/* main grid: copy on left, verification on right */}
                <div className="cert-main">
                  <div className="cert-copy">
                    <div className="cert-eyebrow">Certificate of</div>
                    <div className="cert-title">VERIFIED<br />WEIRDNESS.</div>

                    <hr className="cert-rule" />

                    <div className="cert-row">
                      <div className="cert-row-label">Awarded to</div>
                      <div className="cert-row-name">{SAMPLE.recipient}</div>
                    </div>

                    <div className="cert-row">
                      <div className="cert-row-label">For the project</div>
                      <div className="cert-row-project">
                        <span className="cert-project-title">{SAMPLE.project}</span>
                        <span className="cert-project-blurb">{SAMPLE.blurb}</span>
                      </div>
                    </div>

                    <div className="cert-row">
                      <div className="cert-row-label">In the category</div>
                      <div className="cert-row-cat">{SAMPLE.category}</div>
                    </div>

                    <div className="cert-row">
                      <div className="cert-row-label">Receiving</div>
                      <div className="cert-row-award">{SAMPLE.award}</div>
                    </div>
                  </div>

                  <aside className="cert-side">
                    <div className="cert-qr-frame">
                      <FakeQR size={148} />
                    </div>
                    <div className="cert-verify">
                      <div className="cert-verify-label">Verify at</div>
                      <div className="cert-verify-url">{SAMPLE.verifyUrl}</div>
                      <div className="cert-verify-hash">hash · {SAMPLE.hash}</div>
                    </div>

                    <div className="cert-serial-box">
                      <div className="cert-serial-label">Builder Serial</div>
                      <div className="cert-serial-value">{SAMPLE.serial}</div>
                    </div>
                  </aside>
                </div>

                <hr className="cert-rule" />

                {/* date + location row */}
                <div className="cert-meta">
                  <div>
                    <div className="cert-meta-label">Issued</div>
                    <div className="cert-meta-value">{SAMPLE.date}</div>
                  </div>
                  <div>
                    <div className="cert-meta-label">Where</div>
                    <div className="cert-meta-value">{SAMPLE.location}</div>
                  </div>
                  <div>
                    <div className="cert-meta-label">Edition</div>
                    <div className="cert-meta-value">First</div>
                  </div>
                </div>

                {/* big VERIFIED stamp + signatures */}
                <div className="cert-foot">
                  <div className="cert-sigs">
                    {[
                      { who: 'OnlyWorks',          role: 'On behalf of OnlyWorks Inc.', name: 'N. T. Oedzer' },
                      { who: SAMPLE.judge,         role: 'Lead judge for this award',   name: SAMPLE.judge },
                      { who: SAMPLE.recipient,     role: 'Recipient (and witness)',     name: SAMPLE.recipient },
                    ].map(s => (
                      <div key={s.who} className="cert-sig">
                        <div className="cert-sig-line" />
                        <div className="cert-sig-role">{s.role}</div>
                        <div className="cert-sig-name">{s.name}</div>
                      </div>
                    ))}
                  </div>

                  <div className="cert-stamp" aria-hidden>
                    <div className="cert-stamp-ring">
                      <div className="cert-stamp-inner">
                        <div className="cert-stamp-title">VERIFIED</div>
                        <div className="cert-stamp-glyph">◆</div>
                        <div className="cert-stamp-sub">WEIRD · ’26</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* bottom strip */}
              <footer className="cert-bottom">
                <span>only-works.com/verify/{SAMPLE.hash}</span>
                <span>◆ ◌ ○</span>
                <span>This certificate stays valid as long as the project does.</span>
              </footer>
            </article>
          </div>
        </div>
      </section>

      {/* explainer / OW conversion strip (hidden in print) */}
      <section className="cert-chrome" style={{
        paddingBottom: 96,
        background: 'var(--ow-paper-warm)',
        borderTop: '2px solid var(--ow-ink)',
        borderBottom: '2px solid var(--ow-ink)',
        paddingTop: 80,
      }}>
        <div className="ow-container">
          <div style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 14,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 800, fontSize: '0.875rem',
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: 'var(--ow-ink)',
          }}>
            <span style={{ display: 'inline-block', width: 56, height: 2, background: 'var(--ow-ink)' }} />
            <span>§ Verify</span>
            <span style={{ color: 'var(--ow-ink-3)' }}>—</span>
            <span>What makes this real</span>
          </div>

          <h2 style={{ marginTop: 18 }}>
            The QR isn&apos;t<br />
            <span style={{ color: 'var(--ow-red)' }}>decoration.</span>
          </h2>

          <p className="lede" style={{ marginTop: 18, maxWidth: 720 }}>
            Every certificate carries a hash that points to your OnlyWorks profile. Anyone — recruiter, friend, sceptical stranger — can scan it and see the live, signed verification page on OnlyWorks. That&apos;s the difference between a sticker and a credential.
          </p>

          <ol style={{
            listStyle: 'none', padding: 0, margin: '48px 0 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
          }}>
            {[
              {
                head: 'You install the hook',
                body: 'One-line install from your OnlyWorks dashboard. The hook quietly captures commit metadata while you build.',
              },
              {
                head: 'Your repo gets signed',
                body: 'When you submit, OW packages your build window into a tamper-evident verification record and signs it.',
              },
              {
                head: 'The cert points to the record',
                body: 'Your serial → hash → verification page. Anyone can resolve it. Anyone can see it. No login required.',
              },
            ].map((step, i) => (
              <li key={i} style={{
                padding: 26,
                border: '2px solid var(--ow-ink)',
                background: 'var(--ow-paper)',
              }}>
                <span className="ow-bignum" style={{
                  fontSize: '3rem', color: 'var(--ow-red)', lineHeight: 0.9,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{
                  fontSize: '1.25rem', marginTop: 12,
                  textTransform: 'none', fontWeight: 800,
                  letterSpacing: '-0.005em',
                }}>{step.head}</h3>
                <p style={{ fontSize: '0.875rem', marginTop: 8 }}>{step.body}</p>
              </li>
            ))}
          </ol>

          <div
            style={{
              marginTop: 48,
              padding: 28,
              border: '2px solid var(--ow-ink)',
              background: 'var(--ow-ink)',
              color: 'var(--ow-paper)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 22,
            }}
          >
            <div>
              <div style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 700, fontSize: '0.6875rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(241,236,226,0.55)',
              }}>
                OnlyWorks
              </div>
              <h3 style={{
                color: 'var(--ow-paper)',
                fontSize: '1.5rem', marginTop: 6,
                textTransform: 'none', fontWeight: 800,
                letterSpacing: '-0.005em',
              }}>
                The verification engine that signed this certificate.
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(241,236,226,0.8)',
                marginTop: 6, maxWidth: 540,
              }}>
                OnlyWorks gives you verifiable proof of real work. Free to start. Used by builders, freelancers, and (now) the verifiably weird.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
              <Link href="/downloads" className="ow-btn ow-btn-primary no-underline" style={{ width: '100%' }}>
                Download OnlyWorks →
              </Link>
              <Link href="/" className="ow-btn ow-btn-ghost no-underline" style={{
                width: '100%',
                borderColor: 'var(--ow-paper)', color: 'var(--ow-paper)',
              }}>
                Learn how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── styles ─────────── */}
      <style>{`
        /* the printable certificate */
        .cert-frame {
          background: linear-gradient(180deg, var(--ow-paper) 0%, var(--ow-paper-warm) 100%);
          padding: 24px;
          border: 1px solid var(--ow-ink-3);
        }
        .cert {
          background: var(--ow-paper);
          aspect-ratio: 11 / 8.5;
          width: 100%;
          padding: 36px 44px;
          display: flex;
          flex-direction: column;
          position: relative;
          border: 3px solid var(--ow-ink);
          box-shadow:
            inset 0 0 0 1px var(--ow-paper),
            inset 0 0 0 6px var(--ow-ink),
            inset 0 0 0 7px var(--ow-paper),
            12px 12px 0 -2px var(--ow-red);
        }
        .cert-top {
          display: flex; justify-content: space-between; align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ow-ink);
        }
        .cert-top-l, .cert-top-r {
          display: flex; flex-direction: column; gap: 2px;
        }
        .cert-top-r { text-align: right; }
        .cert-top-mark {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900; font-size: 0.875rem;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ow-ink);
        }
        .cert-top-sub {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 600; font-size: 0.625rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }
        .cert-body { flex: 1; display: flex; flex-direction: column; padding-top: 18px; }
        .cert-main {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
          gap: 36px;
        }
        .cert-copy { display: flex; flex-direction: column; gap: 18px; }
        .cert-eyebrow {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 600; font-size: 0.6875rem;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }
        .cert-title {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          font-size: clamp(2.5rem, 7vw, 5.5rem);
          line-height: 0.82;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: var(--ow-ink);
          margin: 4px 0 0;
        }
        .cert-rule {
          border: 0; border-top: 1px solid var(--ow-ink);
          margin: 18px 0;
        }
        .cert-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 16px;
          align-items: baseline;
          padding: 8px 0;
        }
        .cert-row-label {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 700; font-size: 0.625rem;
          letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }
        .cert-row-name {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900;
          font-size: clamp(1.5rem, 3.5vw, 2.5rem);
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--ow-ink);
          line-height: 0.95;
        }
        .cert-row-project { display: flex; flex-direction: column; gap: 4px; }
        .cert-project-title {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 800;
          font-size: clamp(1.25rem, 2.5vw, 1.875rem);
          letter-spacing: -0.005em;
          color: var(--ow-red);
          line-height: 1;
        }
        .cert-project-blurb {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-style: italic;
          font-size: 0.9375rem;
          color: var(--ow-ink-2);
          line-height: 1.35;
        }
        .cert-row-cat,
        .cert-row-award {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 800; font-size: 1rem;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--ow-ink);
        }

        .cert-side {
          display: flex; flex-direction: column; gap: 14px;
          padding: 18px;
          border: 1px solid var(--ow-ink);
          background: var(--ow-paper-warm);
        }
        .cert-qr-frame {
          padding: 8px;
          background: var(--ow-paper);
          border: 1px solid var(--ow-ink);
          align-self: center;
        }
        .cert-verify {
          display: flex; flex-direction: column; gap: 2px;
          padding-bottom: 10px;
          border-bottom: 1px dashed var(--ow-ink);
        }
        .cert-verify-label {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 700; font-size: 0.625rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }
        .cert-verify-url {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 800; font-size: 0.8125rem;
          letter-spacing: 0.01em;
          color: var(--ow-ink);
          word-break: break-all;
        }
        .cert-verify-hash {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 0.6875rem;
          color: var(--ow-ink-3);
          letter-spacing: 0.04em;
        }

        .cert-serial-box { display: flex; flex-direction: column; gap: 2px; }
        .cert-serial-label {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 700; font-size: 0.625rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }
        .cert-serial-value {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900; font-size: 1.125rem;
          letter-spacing: -0.005em;
          color: var(--ow-red);
        }

        .cert-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid var(--ow-ink);
        }
        .cert-meta-label {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 700; font-size: 0.625rem;
          letter-spacing: 0.24em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }
        .cert-meta-value {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900; font-size: 1.125rem;
          letter-spacing: 0;
          color: var(--ow-ink);
          margin-top: 2px;
        }

        .cert-foot {
          margin-top: auto;
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.7fr);
          gap: 28px;
          align-items: flex-end;
          padding-top: 20px;
        }
        .cert-sigs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .cert-sig { display: flex; flex-direction: column; gap: 4px; }
        .cert-sig-line {
          height: 1px; background: var(--ow-ink);
          margin-bottom: 4px;
        }
        .cert-sig-role {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 700; font-size: 0.625rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }
        .cert-sig-name {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 800; font-size: 0.875rem;
          letter-spacing: 0;
          color: var(--ow-ink);
        }

        /* the wax-style verified stamp */
        .cert-stamp {
          justify-self: end;
          width: 132px; height: 132px;
          display: flex; align-items: center; justify-content: center;
          transform: rotate(-6deg);
        }
        .cert-stamp-ring {
          width: 100%; height: 100%;
          border: 2.5px solid var(--ow-red);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: inset 0 0 0 1.5px var(--ow-paper),
                      inset 0 0 0 3px var(--ow-red);
        }
        .cert-stamp-inner {
          width: 88%; height: 88%;
          border: 1px dashed var(--ow-red);
          border-radius: 50%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 2px;
          color: var(--ow-red);
          text-align: center;
        }
        .cert-stamp-title {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 900; font-size: 0.9375rem;
          letter-spacing: 0.06em; text-transform: uppercase;
          line-height: 1;
        }
        .cert-stamp-glyph { font-size: 1.5rem; line-height: 1; }
        .cert-stamp-sub {
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 800; font-size: 0.6875rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          line-height: 1;
        }

        .cert-bottom {
          margin-top: 18px;
          padding-top: 10px;
          border-top: 1px solid var(--ow-ink);
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-family: 'Big Shoulders Display', sans-serif;
          font-weight: 600; font-size: 0.625rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--ow-ink-3);
        }

        @media (max-width: 880px) {
          .cert { aspect-ratio: auto; padding: 24px; }
          .cert-main { grid-template-columns: 1fr; }
          .cert-foot { grid-template-columns: 1fr; }
          .cert-sigs { grid-template-columns: 1fr; }
          .cert-stamp { justify-self: start; }
          .cert-meta { grid-template-columns: 1fr 1fr; }
        }

        @media print {
          .cert-chrome { display: none !important; }
          .cert-stage { padding: 0 !important; }
          .cert-frame { background: white !important; padding: 0 !important; border: 0 !important; }
          .cert { box-shadow: none !important; border: 2px solid #1c1b18 !important; aspect-ratio: 11 / 8.5; }
          body, .hackathon-shell { background: white !important; }
        }
      `}</style>
    </>
  )
}

function PrintButton() {
  // simple inline print trigger. wraps a regular anchor so it ssr-renders cleanly.
  return (
    <button
      type="button"
      className="ow-btn"
      onClick={typeof window !== 'undefined' ? () => window.print() : undefined}
      suppressHydrationWarning
    >
      Print / save as PDF →
    </button>
  )
}

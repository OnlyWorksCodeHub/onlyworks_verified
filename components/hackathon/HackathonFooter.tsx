import Link from 'next/link'

export function HackathonFooter() {
  return (
    <footer
      style={{
        background: 'var(--ow-ink)',
        color: 'var(--ow-paper)',
        marginTop: 96,
        borderTop: '6px solid var(--ow-red)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="ow-container" style={{ padding: '64px 24px 48px' }}>
        {/* big colophon mark */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          paddingBottom: 36,
          borderBottom: '1px solid rgba(241,236,226,0.25)',
        }}>
          <div style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.04em',
            lineHeight: 0.82,
          }}>
            ONLYHACKS<br />
            <span style={{ color: 'var(--ow-red)' }}>’26.</span>
            <div style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: '0.22em',
              textTransform: 'none',
              color: 'rgba(241,236,226,0.55)',
              letterSpacing: '-0.01em',
              marginTop: 10,
              lineHeight: 1.1,
            }}>
              for the <span style={{ color: 'var(--ow-red)' }}>onlyweird.</span>
            </div>
          </div>
          <div style={{ maxWidth: 360 }}>
            <div style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(241,236,226,0.55)',
              marginBottom: 10,
            }}>
              Colophon
            </div>
            <p style={{
              color: 'rgba(241,236,226,0.85)',
              fontSize: '0.9375rem',
              lineHeight: 1.55,
              margin: 0,
            }}>
              ONLYHACKS for the ONLYWEIRD ’26 is a 48-hour online hackathon hosted by OnlyWorks, co-hosted with{' '}
              <a
                href="https://auto-pm-theta.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                style={{
                  color: 'var(--ow-paper)',
                  backgroundImage: 'linear-gradient(rgba(241,236,226,0.85), rgba(241,236,226,0.85))',
                  backgroundSize: '100% 1px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0 100%',
                }}
              >Orbis, by Gryffin</a>, for builders who would rather ship the joke. 18 — 20 June 2026. Fully online, behind an unmarked URL.
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 32,
            paddingTop: 36,
          }}
        >
          {[
            {
              kicker: 'Navigate',
              items: [
                ['/hackathon',          'Index'],
                ['/hackathon/schedule', 'Schedule'],
                ['/hackathon/projects', 'Projects'],
                ['/hackathon/rules',    'Rules & FAQ'],
                ['/hackathon/register', 'Register'],
              ],
            },
            {
              kicker: 'Contact',
              items: [
                ['mailto:weird@only-works.com', 'weird@only-works.com'],
                ['#', 'Discord — invite emailed before kickoff'],
                ['https://twitter.com/OnlyWorksAI', 'Twitter — @OnlyWorksAI'],
              ],
            },
            {
              kicker: 'Parent process',
              items: [
                ['/',        '↩ Back to OnlyWorks'],
                ['/about',   'About'],
                ['/hiring',  'Hiring'],
                ['/privacy', 'Privacy'],
              ],
            },
          ].map((col, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 700, fontSize: '0.6875rem',
                letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'rgba(241,236,226,0.45)', marginBottom: 14,
              }}>
                {col.kicker}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {col.items.map(([href, label]) => {
                  const linkStyle = {
                    color: 'rgba(241,236,226,0.85)',
                    fontSize: '0.9375rem',
                    backgroundImage: 'linear-gradient(rgba(241,236,226,0.85), rgba(241,236,226,0.85))',
                    backgroundSize: '100% 1px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '0 100%',
                  }
                  const isExternal = /^(https?:|mailto:)/.test(href)
                  const isStatic = href === '#'
                  return (
                    <li key={label}>
                      {isStatic ? (
                        // No real destination yet (e.g. Discord invite is emailed) —
                        // render as plain text so it isn't a link to nowhere.
                        <span style={{ color: 'rgba(241,236,226,0.55)', fontSize: '0.9375rem' }}>{label}</span>
                      ) : isExternal ? (
                        <a
                          href={href}
                          className="no-underline"
                          target={href.startsWith('mailto:') ? undefined : '_blank'}
                          rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                          style={linkStyle}
                        >
                          {label}
                        </a>
                      ) : (
                        <Link href={href} className="no-underline" style={linkStyle}>
                          {label}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          <div>
            <div style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700, fontSize: '0.6875rem',
              letterSpacing: '0.24em', textTransform: 'uppercase',
              color: 'rgba(241,236,226,0.45)', marginBottom: 14,
            }}>
              Set in
            </div>
            <p style={{
              color: 'rgba(241,236,226,0.7)',
              fontSize: '0.875rem',
              margin: 0, lineHeight: 1.6,
            }}>
              Display: Big Shoulders Display.<br />
              Body: Bricolage Grotesque.<br />
              One accent ink: <span style={{ color: 'var(--ow-red)' }}>vermilion #e63a13</span>.<br />
              Pulped onto bone #f1ece2.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid rgba(241,236,226,0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 600,
            fontSize: '0.6875rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(241,236,226,0.5)',
          }}
        >
          <span>© 2026 ONLYWORKS INC. × ORBIS · ISSUE 00026 · PRESS PROOF</span>
          <span>Printed on the internet — please dispose responsibly</span>
        </div>
      </div>
    </footer>
  )
}

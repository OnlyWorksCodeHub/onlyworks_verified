'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { label: 'index',    href: '/hackathon' },
  { label: 'schedule', href: '/hackathon/schedule' },
  { label: 'projects', href: '/hackathon/projects' },
  { label: 'rules',    href: '/hackathon/rules' },
]

export function HackathonNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      style={{
        background: 'var(--ow-paper)',
        borderBottom: '2px solid var(--ow-ink)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="ow-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 24,
          padding: '18px 24px',
        }}
      >
        {/* wordmark */}
        <Link
          href="/hackathon"
          className="no-underline"
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 8,
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'var(--ow-ink)',
            backgroundImage: 'none',
          }}
        >
          <span className="ow-mark-main" style={{
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            ONLYHACKS
          </span>
          <span className="ow-mark-year" style={{
            color: 'var(--ow-red)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}>
            ’26
          </span>
          <span className="ow-mark-strap" style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: '0.75rem',
            textTransform: 'none',
            color: 'var(--ow-ink-3)',
            letterSpacing: '0',
            lineHeight: 1,
          }}>
            for the <span style={{ color: 'var(--ow-red)' }}>onlyweird.</span>
          </span>
        </Link>

        {/* center nav (desktop) */}
        <ul
          style={{
            display: 'none',
            listStyle: 'none',
            margin: 0, padding: 0,
            gap: 36, justifyContent: 'center', alignItems: 'baseline',
          }}
          className="ow-nav-list"
        >
          {links.map(({ label, href }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="no-underline"
                  style={{
                    fontFamily: "'Big Shoulders Display', sans-serif",
                    fontWeight: active ? 900 : 700,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: active ? 'var(--ow-red)' : 'var(--ow-ink)',
                    paddingBottom: 4,
                    borderBottom: active ? '2px solid var(--ow-red)' : '2px solid transparent',
                    transition: 'color 0.12s, border-color 0.12s',
                  }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Link
            href="/"
            className="no-underline"
            style={{
              display: 'none',
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700,
              fontSize: '0.6875rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--ow-ink-3)',
            }}
            data-show-md
          >
            ↩ ONLYWORKS
          </Link>

          <Link
            href="/hackathon/register"
            className="no-underline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'var(--ow-red)',
              color: 'var(--ow-paper)',
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 800,
              fontSize: '0.8125rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              border: '2px solid var(--ow-ink)',
              boxShadow: '3px 3px 0 0 var(--ow-ink)',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translate(-1px, -1px)'
              e.currentTarget.style.boxShadow = '4px 4px 0 0 var(--ow-ink)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '3px 3px 0 0 var(--ow-ink)'
            }}
          >
            Register →
          </Link>

          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            className="ow-menu-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40,
              border: '2px solid var(--ow-ink)',
              background: 'transparent',
              color: 'var(--ow-ink)',
              cursor: 'pointer',
              padding: 0,
              fontSize: 18,
            }}
          >
            <span aria-hidden style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, lineHeight: 1 }}>
              {open ? '×' : '≡'}
            </span>
          </button>
        </div>
      </div>

      {/* sub-rule (the thick black bar under the nav) */}
      <div aria-hidden style={{ height: 6, background: 'var(--ow-ink)' }} />

      {/* mobile menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0, right: 0,
            background: 'var(--ow-paper)',
            borderBottom: '2px solid var(--ow-ink)',
            boxShadow: '0 12px 0 -6px var(--ow-ink)',
          }}
        >
          <ul style={{
            listStyle: 'none', padding: '12px 24px 22px', margin: 0,
            display: 'grid', gap: 0,
          }}>
            {links.map(({ label, href }, i) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="no-underline"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '16px 0',
                      borderBottom: i === links.length - 1 ? 'none' : '1px solid var(--ow-ink)',
                      fontFamily: "'Big Shoulders Display', sans-serif",
                      fontWeight: 900,
                      fontSize: '2rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      color: active ? 'var(--ow-red)' : 'var(--ow-ink)',
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </li>
              )
            })}
            <li style={{ marginTop: 14, display: 'flex', gap: 12 }}>
              <Link href="/hackathon/register" className="ow-btn ow-btn-primary no-underline" style={{ flex: 1 }}>
                Register →
              </Link>
            </li>
            <li style={{ marginTop: 10 }}>
              <Link
                href="/"
                className="no-underline"
                style={{
                  display: 'block',
                  padding: '10px 0',
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ow-ink-3)',
                }}
              >
                ↩ Back to OnlyWorks
              </Link>
            </li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .ow-mark-main { font-size: 1.25rem; }
        .ow-mark-year { font-size: 0.8125rem; }
        .ow-mark-strap { display: none; }
        @media (min-width: 520px) {
          .ow-mark-main { font-size: 1.625rem; }
          .ow-mark-year { font-size: 1rem; }
          .ow-mark-strap { display: inline-flex; }
        }
        @media (min-width: 880px) {
          .ow-nav-list { display: flex !important; }
          .ow-menu-btn { display: none !important; }
          [data-show-md] { display: inline-flex !important; }
        }
      `}</style>
    </header>
  )
}

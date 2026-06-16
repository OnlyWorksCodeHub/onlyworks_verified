'use client'

import Link from 'next/link'
import { useEffect, useState, FormEvent } from 'react'
import { Countdown } from '@/components/hackathon/Countdown'

type Mode = 'intro' | 'idle' | 'submitting' | 'done'

type OwIdStatus =
  | { kind: 'empty' }
  | { kind: 'checking' }
  | { kind: 'valid'; handle: string | null; displayName: string | null }
  | { kind: 'invalid'; reason: string }
  | { kind: 'unreachable' }
type EmailStatus =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; sentTo: string }
  | { kind: 'verifying' }
  | { kind: 'verified'; verifiedEmail: string }
  | { kind: 'error'; reason: string }

interface FormState {
  name: string
  email: string
  owId: string
  github: string
  discord: string
  blurb: string
  team: 'solo' | 'team'
  teamName: string
  referrer: string
  agree: boolean
}

const INITIAL: FormState = {
  name: '', email: '', owId: '', github: '', discord: '', blurb: '',
  team: 'solo', teamName: '',
  referrer: '',
  agree: false,
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [mode, setMode] = useState<Mode>('intro')
  const [serial, setSerial] = useState<string>('')
  const [owStatus, setOwStatus] = useState<OwIdStatus>({ kind: 'empty' })
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({ kind: 'idle' })
  const [emailCode, setEmailCode] = useState<string>('')
  const [submitError, setSubmitError] = useState<string>('')

  // Debounced OW ID verification — runs every time the field changes.
  // Server response is the source of truth; the client never assumes valid on its own.
  useEffect(() => {
    const id = form.owId.trim()
    if (!id) { setOwStatus({ kind: 'empty' }); return }
    setOwStatus({ kind: 'checking' })
    const controller = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/hackathon/verify-ow-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ owId: id }),
          signal: controller.signal,
        })
        const data = await res.json().catch(() => ({}))
        if (controller.signal.aborted) return
        if (res.status === 503) {
          setOwStatus({ kind: 'unreachable' })
        } else if (data.valid) {
          setOwStatus({ kind: 'valid', handle: data.handle ?? null, displayName: data.displayName ?? null })
        } else {
          setOwStatus({ kind: 'invalid', reason: data.error || 'Not a valid OW ID' })
        }
      } catch {
        if (!controller.signal.aborted) setOwStatus({ kind: 'unreachable' })
      }
    }, 450)
    return () => { controller.abort(); clearTimeout(t) }
  }, [form.owId])

  // If the user edits the email after verifying, the verification is no longer valid.
  useEffect(() => {
    if (emailStatus.kind === 'verified' && emailStatus.verifiedEmail !== form.email.trim().toLowerCase()) {
      setEmailStatus({ kind: 'idle' })
      setEmailCode('')
    }
    if (emailStatus.kind === 'sent' && emailStatus.sentTo !== form.email.trim().toLowerCase()) {
      setEmailStatus({ kind: 'idle' })
      setEmailCode('')
    }
  }, [form.email, emailStatus])

  async function sendEmailCode() {
    const email = form.email.trim().toLowerCase()
    if (!email) return
    setEmailStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/hackathon/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.ok) {
        setEmailStatus({ kind: 'sent', sentTo: email })
      } else {
        setEmailStatus({ kind: 'error', reason: data.error || 'Could not send a code right now.' })
      }
    } catch {
      setEmailStatus({ kind: 'error', reason: 'Network error. Try again in a moment.' })
    }
  }

  async function verifyEmailCode() {
    const email = form.email.trim().toLowerCase()
    const code = emailCode.trim()
    if (!email || !/^\d{6}$/.test(code)) {
      setEmailStatus({ kind: 'error', reason: 'Enter the 6-digit code from your inbox.' })
      return
    }
    setEmailStatus({ kind: 'verifying' })
    try {
      const res = await fetch('/api/hackathon/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.valid) {
        setEmailStatus({ kind: 'verified', verifiedEmail: email })
      } else {
        setEmailStatus({ kind: 'error', reason: data.error || 'Code does not match.' })
      }
    } catch {
      setEmailStatus({ kind: 'error', reason: 'Could not reach OnlyWorks to verify the code.' })
    }
  }

  function dismissIntro() {
    setMode('idle')
  }

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(p => ({ ...p, [k]: v }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitError('')
    if (!form.agree || !form.email || !form.name) {
      setSubmitError('Fill out the required fields before submitting.')
      return
    }
    if (emailStatus.kind !== 'verified' || emailStatus.verifiedEmail !== form.email.trim().toLowerCase()) {
      setSubmitError('Verify your email with the 6-digit code before submitting.')
      return
    }
    // OW ID is optional, but if one was entered it must be a valid OW ID —
    // a wrong ID would fail server verification anyway.
    if (form.owId.trim() && owStatus.kind === 'invalid') {
      setSubmitError('Fix your OW ID or clear the field — it’s optional, so you can leave it blank.')
      return
    }
    setMode('submitting')
    // The server re-verifies the OW ID and the email cookie, stores the row,
    // and issues the serial — the client never invents its own admission.
    try {
      const res = await fetch('/api/hackathon/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setMode('idle')
        setSubmitError(data.error || 'Could not save your registration right now. Try again in a moment.')
        return
      }
      setSerial(data.serial)
      setMode('done')
    } catch {
      setMode('idle')
      setSubmitError('Could not reach OnlyWorks to register. Try again in a moment.')
      return
    }
  }

  function reset() {
    setForm(INITIAL)
    setSerial('')
    setMode('idle')
  }

  function focusField(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
  }

  // The stamps that unlock the submit button. Single source of truth for both
  // the stamp card and the button's disabled state. OW ID is optional, so it is
  // not a gate here — it's verified live in its own field when supplied.
  const emailVerified = emailStatus.kind === 'verified' && emailStatus.verifiedEmail === form.email.trim().toLowerCase()
  const stamps = [
    {
      key: 'name', label: 'Name',
      done: !!form.name.trim(),
      hint: 'add your name',
      target: 'reg-field-name',
    },
    {
      key: 'email', label: 'Email verified',
      done: emailVerified,
      hint: form.email.trim() ? 'enter the 6-digit code' : 'add + verify your email',
      target: 'reg-field-email',
    },
    {
      key: 'rules', label: 'Rules agreed',
      done: form.agree,
      hint: 'tick the box',
      target: 'reg-field-agree',
    },
  ]
  const stamped = stamps.filter(s => s.done).length
  const blocked = stamped < stamps.length

  if (mode === 'intro') {
    return <IntroGate onContinue={dismissIntro} />
  }

  if (mode === 'done') {
    return <AdmittedView serial={serial} name={form.name} onAnother={reset} />
  }

  return (
    <section style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="ow-container" style={{ maxWidth: 980 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
          <Link href="/hackathon" className="no-underline" style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 700, fontSize: '0.75rem',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--ow-ink-3)',
          }}>↩ Index</Link>
          <span className="ow-stamp ow-stamp-tilt-r">Registration open</span>
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
          Register.<wbr /><span style={{ color: 'var(--ow-red)' }}>card</span>
        </h1>

        <hr className="ow-rule-fat" style={{ marginTop: 8 }} />

        <p className="lede" style={{ marginTop: 24, maxWidth: 660 }}>
          One form. Zero cost. Registration binds you to the calendar — not to your project. You can show up, no-show, or rage-quit. All valid. Only the rage-quit gets a sticker.
        </p>

        <div style={{
          marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 28,
          fontSize: '0.875rem', color: 'var(--ow-ink-2)',
        }}>
          <span>
            <span className="ow-label ow-label-mute">Kickoff in </span>
            <span className="ow-serial" style={{ color: 'var(--ow-ink)', fontSize: '1rem' }}>
              <Countdown compact />
            </span>
          </span>
          <span>· ~90 second form</span>
          <span>· Data stays inside OnlyWorks</span>
        </div>

        {/* form card */}
        <form
          onSubmit={onSubmit}
          aria-busy={mode === 'submitting'}
          style={{
            marginTop: 40,
            position: 'relative',
            border: '3px solid var(--ow-ink)',
            background: 'var(--ow-paper)',
            boxShadow: '8px 8px 0 0 var(--ow-red)',
            opacity: mode === 'submitting' ? 0.55 : 1,
            pointerEvents: mode === 'submitting' ? 'none' : 'auto',
            transition: 'opacity 0.2s',
          }}
        >
          {/* card header strip */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '14px 22px',
            background: 'var(--ow-ink)',
            color: 'var(--ow-paper)',
          }}>
            <div style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 900, fontSize: '0.875rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>
              ONLYHACKS for the ONLYWEIRD ’26 · Builder registration card
            </div>
            <div style={{
              fontFamily: "'Big Shoulders Display', sans-serif",
              fontWeight: 700, fontSize: '0.6875rem',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(241,236,226,0.55)',
            }}>
              Form / Nº 00026
            </div>
          </div>

          <div style={{ padding: 32, display: 'grid', gap: 28 }}>
            <Row label="Full name" hint="How it appears on your verified-weird badge. Real or chosen, both fine.">
              <input
                id="reg-field-name"
                type="text"
                required
                className="ow-input"
                placeholder="e.g. Ren M. Ortega"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                autoComplete="name"
              />
            </Row>

            <Row
              label="OnlyWorks ID · optional"
              hint={<>Optional — but it&apos;s how your build gets verified and how you earn a cert anyone can check. Create a free account + download the desktop app at <Link href="/" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>onlyworks.com</Link>, then paste your OW ID here — we verify it before accepting it. Skip it and you&apos;re still in; you just won&apos;t be verified-weird (yet).</>}
            >
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 10,
                borderBottom: `2px solid ${
                  owStatus.kind === 'valid' ? 'var(--ow-red)' :
                  owStatus.kind === 'invalid' ? 'var(--ow-red)' :
                  'var(--ow-ink)'
                }`,
              }}>
                <span style={{
                  paddingRight: 10, fontSize: '1.0625rem',
                  color: 'var(--ow-red)', fontWeight: 700,
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  letterSpacing: '0.05em',
                }}>OW-</span>
                <input
                  id="reg-field-owid"
                  type="text"
                  className="ow-input"
                  style={{ border: 'none', padding: '14px 0', flex: 1 }}
                  placeholder="A1B2C3D4 (optional)"
                  value={form.owId}
                  onChange={e => update('owId', e.target.value.replace(/^OW-?/i, '').toUpperCase())}
                  pattern="[A-Z0-9]{4,12}"
                  autoComplete="off"
                  aria-invalid={owStatus.kind === 'invalid'}
                />
                <OwIdBadge status={owStatus} />
              </div>
              {owStatus.kind === 'invalid' && (
                <div style={{ marginTop: 6, fontSize: '0.8125rem', color: 'var(--ow-red)' }}>
                  ◆ {owStatus.reason}
                </div>
              )}
              {owStatus.kind === 'unreachable' && (
                <div style={{ marginTop: 6, fontSize: '0.8125rem', color: 'var(--ow-ink-3)' }}>
                  Could not reach OnlyWorks to verify right now — we&apos;ll re-check on submit.
                </div>
              )}
              {owStatus.kind === 'valid' && owStatus.displayName && (
                <div style={{ marginTop: 6, fontSize: '0.8125rem', color: 'var(--ow-ink-2)' }}>
                  Verified: <strong style={{ color: 'var(--ow-ink)' }}>{owStatus.displayName}</strong>
                  {owStatus.handle ? <> · @{owStatus.handle}</> : null}
                </div>
              )}
            </Row>

            <Row label="Email" hint="Required + verified. We send invites + the finals stream link here.">
              <input
                id="reg-field-email"
                type="email"
                required
                className="ow-input"
                placeholder="you@somewhere.weird"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                autoComplete="email"
                aria-invalid={emailStatus.kind === 'error'}
              />
              <EmailVerifyControls
                email={form.email}
                status={emailStatus}
                code={emailCode}
                setCode={setEmailCode}
                onSend={sendEmailCode}
                onVerify={verifyEmailCode}
              />
            </Row>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }} className="ow-form-pair">
              <Row label="GitHub" hint="Optional. Used only to verify your build is yours.">
                <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '2px solid var(--ow-ink)' }}>
                  <span style={{
                    paddingRight: 10, fontSize: '1.0625rem',
                    color: 'var(--ow-ink-3)', fontWeight: 500,
                  }}>@</span>
                  <input
                    type="text"
                    className="ow-input"
                    style={{ border: 'none', padding: '14px 0' }}
                    placeholder="your-handle"
                    value={form.github}
                    onChange={e => update('github', e.target.value.replace(/^@+/, ''))}
                  />
                </div>
              </Row>

              <Row label="Discord" hint="Optional but smart. This is the handle we pull into the ONLYWEIRD Discord before kickoff.">
                <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '2px solid var(--ow-ink)' }}>
                  <span style={{
                    paddingRight: 10, fontSize: '1.0625rem',
                    color: 'var(--ow-ink-3)', fontWeight: 500,
                  }}>@</span>
                  <input
                    type="text"
                    className="ow-input"
                    style={{ border: 'none', padding: '14px 0' }}
                    placeholder="yourhandle"
                    value={form.discord}
                    onChange={e => update('discord', e.target.value.replace(/^@+/, ''))}
                    autoComplete="off"
                  />
                </div>
              </Row>
            </div>

            <Row
              label="What flavour of weird are you?"
              hint="≤ 280 characters. Examples: ‘I make synths out of stationery’, ‘I overengineer recipes’, ‘I ship printer drivers for sport’."
            >
              <textarea
                className="ow-input"
                rows={3}
                maxLength={280}
                placeholder="One sentence. Honest. The weirdest true thing about how you build."
                value={form.blurb}
                onChange={e => update('blurb', e.target.value.slice(0, 280))}
              />
              <div className="ow-label ow-label-mute" style={{ marginTop: 6, textAlign: 'right' }}>
                {form.blurb.length} / 280
              </div>
            </Row>

            <Row label="Solo or team?" hint="Teams up to four (4). Team names are visible to judges and the world.">
              <div style={{ display: 'flex', gap: 10 }}>
                {(['solo', 'team'] as const).map(t => {
                  const active = form.team === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update('team', t)}
                      style={{
                        flex: 1,
                        padding: '14px 18px',
                        border: '2px solid var(--ow-ink)',
                        background: active ? 'var(--ow-ink)' : 'transparent',
                        color: active ? 'var(--ow-paper)' : 'var(--ow-ink)',
                        fontFamily: "'Big Shoulders Display', sans-serif",
                        fontWeight: 800, fontSize: '0.9375rem',
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {active ? '◆ ' : '◇ '}{t}
                    </button>
                  )
                })}
              </div>
              {form.team === 'team' && (
                <input
                  type="text"
                  className="ow-input"
                  style={{ marginTop: 14 }}
                  placeholder="Team name (or placeholder — rename later)"
                  value={form.teamName}
                  onChange={e => update('teamName', e.target.value)}
                />
              )}
            </Row>

            <Row label="How did you find us?" hint="Optional. We just like knowing.">
              <select
                className="ow-input"
                value={form.referrer}
                onChange={e => update('referrer', e.target.value)}
              >
                <option value="">— pick one —</option>
                <option value="twitter">Twitter / X</option>
                <option value="friend">A weird friend</option>
                <option value="discord">Discord server</option>
                <option value="newsletter">Newsletter</option>
                <option value="hn">Hacker News</option>
                <option value="onlyworks">OnlyWorks main site</option>
                <option value="other">Other</option>
              </select>
            </Row>

            <label
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: 18,
                border: '2px solid var(--ow-ink)',
                background: 'var(--ow-paper-warm)',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                color: 'var(--ow-ink)',
              }}
            >
              <input
                id="reg-field-agree"
                type="checkbox"
                checked={form.agree}
                onChange={e => update('agree', e.target.checked)}
                required
                style={{
                  marginTop: 4,
                  accentColor: '#e63a13',
                  width: 16, height: 16,
                }}
              />
              <span>
                <strong style={{ color: 'var(--ow-red)' }}>◆ </strong>
                I agree to the <Link href="/hackathon/rules" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>rules</Link> and the OnlyWorks <Link href="/terms" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>terms</Link>. I understand my project will be publicly listed in the Hall of Weird and that judges will laugh at it (kindly).
              </span>
            </label>

            <hr className="ow-rule" />

            {/* stamp card — the four gates between you and the button */}
            <div
              role="status"
              aria-label={`${stamped} of ${stamps.length} requirements complete`}
              style={{
                border: blocked ? '2px solid var(--ow-ink)' : '2px solid var(--ow-red)',
                background: blocked ? 'var(--ow-paper-warm)' : 'var(--ow-red-pale)',
                padding: '18px 20px',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                flexWrap: 'wrap', gap: 10, marginBottom: 14,
              }}>
                <span className="ow-label" style={{ color: blocked ? 'var(--ow-ink)' : 'var(--ow-red)' }}>
                  Stamp card · {stamped} / {stamps.length}
                </span>
                <span className="ow-label ow-label-mute">
                  {blocked ? 'All four stamps unlock the button — tap a missing one' : '◆ Fully stamped. Send it.'}
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 10,
              }}>
                {stamps.map((s, i) => s.done ? (
                  <div
                    key={s.key}
                    style={{
                      border: '2px solid var(--ow-red)',
                      color: 'var(--ow-red)',
                      background: 'var(--ow-paper)',
                      padding: '12px 14px',
                      transform: i % 2 ? 'rotate(0.7deg)' : 'rotate(-0.7deg)',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Big Shoulders Display', sans-serif",
                      fontWeight: 900, fontSize: '0.9375rem',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>
                      ◆ {s.label}
                    </div>
                    <div className="ow-label ow-label-mute" style={{ marginTop: 4 }}>stamped</div>
                  </div>
                ) : (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => focusField(s.target)}
                    style={{
                      border: '2px dashed var(--ow-ink-3)',
                      background: 'transparent',
                      color: 'var(--ow-ink-2)',
                      padding: '12px 14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Big Shoulders Display', sans-serif",
                      fontWeight: 900, fontSize: '0.9375rem',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>
                      ◇ {s.label}
                    </div>
                    <div style={{
                      marginTop: 4, fontSize: '0.8125rem',
                      color: 'var(--ow-red)', fontWeight: 600,
                    }}>
                      → {s.hint}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 14,
            }}>
              <div className="ow-label ow-label-mute">
                Builder &ldquo;{form.name || '—'}&rdquo;
              </div>
              <button
                type="submit"
                className="ow-btn ow-btn-primary no-underline"
                disabled={blocked}
                style={{
                  opacity: blocked ? 0.4 : 1,
                  cursor: blocked ? 'not-allowed' : 'pointer',
                }}
              >
                Submit registration →
              </button>
            </div>

            {submitError && (
              <div role="alert" style={{
                marginTop: 4,
                padding: '12px 16px',
                border: '2px solid var(--ow-red)',
                background: 'var(--ow-paper)',
                color: 'var(--ow-red)',
                fontSize: '0.875rem',
              }}>
                ◆ {submitError}
              </div>
            )}

            {mode === 'submitting' && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  marginTop: 8,
                  padding: '14px 18px',
                  border: '2px solid var(--ow-red)',
                  background: 'var(--ow-red-pale)',
                  fontFamily: "'Big Shoulders Display', sans-serif",
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--ow-red)',
                }}
              >
                Stamping your card…
              </div>
            )}
          </div>
        </form>

        <style>{`
          @media (max-width: 700px) {
            .ow-form-pair { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

function IntroGate({ onContinue }: { onContinue: () => void }) {
  return (
    <section style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="ow-container" style={{ maxWidth: 980 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
          <Link href="/hackathon" className="no-underline" style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 700, fontSize: '0.75rem',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--ow-ink-3)',
          }}>↩ Index</Link>
          <span className="ow-stamp ow-stamp-tilt-r">First time? Start here</span>
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
          Read this<br />
          <span style={{ color: 'var(--ow-red)' }}>before you register.</span>
        </h1>

        <hr className="ow-rule-fat" style={{ marginTop: 8 }} />

        <p className="lede" style={{ marginTop: 24, maxWidth: 720 }}>
          ONLYHACKS for the ONLYWEIRD &apos;26 runs on <strong style={{ color: 'var(--ow-ink)' }}>OnlyWorks</strong> — a verification engine that turns your real work into a credential anyone can verify with one link. Registration is open to everyone, but linking an OnlyWorks account is <strong style={{ color: 'var(--ow-red)' }}>strongly recommended</strong>: (1) create a free OnlyWorks account, (2) download the desktop app, (3) drop your OW ID into the form on the next page. It&apos;s how your build gets verified and how you earn a cert anyone can check — skip it and you&apos;re still in, just not verified-weird.
        </p>

        {/* the three-card mini-explainer */}
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '40px 0 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
          }}
        >
          {[
            {
              n: '01',
              head: 'OnlyWorks captures your build',
              body: 'You install the desktop app + a one-line repo hook. It records what you actually shipped — locally, end-to-end encrypted, on your terms.',
            },
            {
              n: '02',
              head: 'It signs the receipt',
              body: 'When you submit, OW packages the build into a tamper-evident verification record and signs it. You can’t fake it — but neither can anyone else.',
            },
            {
              n: '03',
              head: 'You get a verifiable cert',
              body: 'Every finalist gets a digital certificate, signed by OnlyWorks, resolvable at only-works.com/verify/<hash>. Recruiters, judges, future-you: anyone can confirm.',
            },
          ].map(step => (
            <li
              key={step.n}
              style={{
                padding: 26,
                border: '2px solid var(--ow-ink)',
                background: 'var(--ow-paper)',
              }}
            >
              <span className="ow-bignum" style={{
                fontSize: '3rem', color: 'var(--ow-red)', lineHeight: 0.9,
              }}>
                {step.n}
              </span>
              <h3 style={{
                fontSize: '1.25rem',
                marginTop: 12,
                textTransform: 'none',
                fontWeight: 800,
                letterSpacing: '-0.005em',
              }}>{step.head}</h3>
              <p style={{ fontSize: '0.875rem', marginTop: 8 }}>{step.body}</p>
            </li>
          ))}
        </ol>

        {/* CTA pair — docs primary, register secondary */}
        <div
          style={{
            marginTop: 48,
            border: '3px solid var(--ow-ink)',
            background: 'var(--ow-paper)',
            boxShadow: '8px 8px 0 0 var(--ow-red)',
            padding: 28,
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
            gap: 32,
            alignItems: 'center',
          }}
            className="ow-intro-cta"
          >
            <div>
              <div className="ow-label">If you have ninety seconds</div>
              <div style={{
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                lineHeight: 0.95,
                marginTop: 6,
              }}>
                Read the<br />
                <span style={{ color: 'var(--ow-red)' }}>OnlyWorks intro first.</span>
              </div>
              <p style={{ marginTop: 12, maxWidth: 480 }}>
                We walk through install, verify, share, and the specific path for hackathon builders. It&apos;s the difference between a sticker and a credential.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link
                href="/about#how-it-works"
                className="ow-btn ow-btn-primary no-underline"
                style={{ justifyContent: 'space-between' }}
              >
                <span>Take me to the intro</span>
                <span aria-hidden>→</span>
              </Link>
              <button
                type="button"
                onClick={onContinue}
                className="ow-btn ow-btn-ghost"
                style={{ justifyContent: 'space-between' }}
              >
                <span>I know OW — register me</span>
                <span aria-hidden>↘</span>
              </button>
            </div>
          </div>
        </div>

        <p style={{
          marginTop: 22, fontSize: '0.8125rem', color: 'var(--ow-ink-3)',
        }}>
          Take a minute — getting OnlyWorks set up before you start is the difference between a sticker and a credential.
        </p>

        <style>{`
          @media (max-width: 700px) {
            .ow-intro-cta { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

function EmailVerifyControls({
  email, status, code, setCode, onSend, onVerify,
}: {
  email: string
  status: EmailStatus
  code: string
  setCode: (v: string) => void
  onSend: () => void
  onVerify: () => void
}) {
  const trimmed = email.trim()
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  const verified = status.kind === 'verified' && status.verifiedEmail === trimmed.toLowerCase()
  const codeStage = status.kind === 'sent' || status.kind === 'verifying' || status.kind === 'error'

  return (
    <div style={{ marginTop: 10 }}>
      {verified ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 10px',
          background: 'var(--ow-red)', color: 'var(--ow-paper)',
          fontFamily: "'Big Shoulders Display', sans-serif",
          fontWeight: 800, fontSize: '0.6875rem',
          letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>
          ◆ Email verified
        </div>
      ) : codeStage ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="\d{6}"
              placeholder="6-digit code"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{
                width: 140,
                padding: '10px 12px',
                border: '2px solid var(--ow-ink)',
                background: 'transparent',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1rem',
                letterSpacing: '0.2em',
                color: 'var(--ow-ink)',
              }}
            />
            <button
              type="button"
              onClick={onVerify}
              disabled={!/^\d{6}$/.test(code) || status.kind === 'verifying'}
              className="ow-btn ow-btn-ghost no-underline"
              style={{
                padding: '8px 14px', fontSize: '0.75rem',
                opacity: (!/^\d{6}$/.test(code) || status.kind === 'verifying') ? 0.4 : 1,
              }}
            >
              {status.kind === 'verifying' ? 'Verifying…' : 'Verify code'}
            </button>
            <button
              type="button"
              onClick={onSend}
              className="no-underline"
              style={{
                padding: '8px 0', fontSize: '0.75rem',
                background: 'transparent', border: 'none',
                color: 'var(--ow-ink-3)',
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Resend
            </button>
          </div>
          {status.kind === 'sent' && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--ow-ink-2)' }}>
              Code sent to <strong style={{ color: 'var(--ow-ink)' }}>{status.sentTo}</strong>. Check your inbox (and spam).
            </div>
          )}
          {status.kind === 'error' && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--ow-red)' }}>
              ◆ {status.reason}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={onSend}
          disabled={!looksLikeEmail || status.kind === 'sending'}
          className="ow-btn ow-btn-ghost no-underline"
          style={{
            padding: '8px 14px', fontSize: '0.75rem',
            opacity: (!looksLikeEmail || status.kind === 'sending') ? 0.4 : 1,
          }}
        >
          {status.kind === 'sending' ? 'Sending…' : 'Send verification code →'}
        </button>
      )}
    </div>
  )
}

function OwIdBadge({ status }: { status: OwIdStatus }) {
  const base = {
    fontFamily: "'Big Shoulders Display', sans-serif",
    fontWeight: 800,
    fontSize: '0.6875rem',
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    padding: '4px 8px',
    whiteSpace: 'nowrap' as const,
  }
  if (status.kind === 'empty') return null
  if (status.kind === 'checking') {
    return <span style={{ ...base, color: 'var(--ow-ink-3)' }}>Checking…</span>
  }
  if (status.kind === 'valid') {
    return <span style={{ ...base, color: 'var(--ow-paper)', background: 'var(--ow-red)' }}>◆ Verified</span>
  }
  if (status.kind === 'invalid') {
    return <span style={{ ...base, color: 'var(--ow-red)', border: '1px solid var(--ow-red)' }}>✗ Invalid</span>
  }
  return <span style={{ ...base, color: 'var(--ow-ink-3)', border: '1px solid var(--ow-ink-3)' }}>Offline</span>
}

function Row({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="ow-label" style={{ display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      {hint && (
        <div style={{ fontSize: '0.8125rem', color: 'var(--ow-ink-2)', marginBottom: 10, lineHeight: 1.5 }}>
          {hint}
        </div>
      )}
      {children}
    </div>
  )
}

function AdmittedView({ serial, name, onAnother }: { serial: string; name: string; onAnother: () => void }) {
  return (
    <section style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="ow-container" style={{ maxWidth: 980 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
          <Link href="/hackathon" className="no-underline" style={{
            fontFamily: "'Big Shoulders Display', sans-serif",
            fontWeight: 700, fontSize: '0.75rem',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--ow-ink-3)',
          }}>↩ Index</Link>
          <span className="ow-stamp ow-stamp-ink ow-stamp-pop">◆ Admitted</span>
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
          You&apos;re<br />
          <span style={{ color: 'var(--ow-red)' }}>in.</span>
        </h1>

        <hr className="ow-rule-fat" style={{ marginTop: 8 }} />

        <p className="lede" style={{ marginTop: 24, maxWidth: 660 }}>
          {name || 'Friend'}, your slot is stamped. A confirmation with your serial is on its way to the address you provided. Discord + calendar details land by email before kickoff. If nothing shows, check spam — and tell us at <a href="mailto:weird@only-works.com" className="no-underline" style={{ color: 'var(--ow-ink)', backgroundImage: 'linear-gradient(var(--ow-ink), var(--ow-ink))', backgroundSize: '100% 2px', backgroundRepeat: 'no-repeat', backgroundPosition: '0 100%' }}>weird@only-works.com</a>.
        </p>

        {/* big serial card */}
        <article style={{
          marginTop: 40,
          border: '3px solid var(--ow-ink)',
          background: 'var(--ow-paper)',
          boxShadow: '8px 8px 0 0 var(--ow-red)',
          padding: 36,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: 32,
          alignItems: 'center',
        }}
          className="ow-admitted-card"
        >
          <div>
            <div className="ow-label">Builder serial</div>
            <div className="ow-bignum" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--ow-red)',
              marginTop: 10,
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
            }}>
              {serial}
            </div>
            <p style={{ marginTop: 16, fontSize: '0.9375rem' }}>
              Keep this serial. It appears on your badge, your submission, and your trophy if you somehow win.
            </p>
          </div>
          <div>
            <div className="ow-label ow-label-mute" style={{ marginBottom: 10 }}>Kickoff in</div>
            <Countdown />
          </div>
        </article>

        <div style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {[
            ['Check inbox',     'Confirmation email with your serial'],
            ['Join Discord',    'Invite lands by email before kickoff'],
            ['Start thinking',  'Weird thoughts. Many of them.'],
          ].map(([head, body]) => (
            <div key={head} style={{ border: '2px solid var(--ow-ink)', padding: 22, background: 'var(--ow-paper)' }}>
              <span className="ow-label">Next</span>
              <div style={{
                marginTop: 6,
                fontFamily: "'Big Shoulders Display', sans-serif",
                fontWeight: 900, fontSize: '1.5rem',
                textTransform: 'uppercase', letterSpacing: '-0.005em',
                color: 'var(--ow-ink)',
              }}>{head}</div>
              <p style={{ marginTop: 8, fontSize: '0.875rem' }}>{body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link href="/hackathon/schedule" className="ow-btn no-underline">
            See the schedule →
          </Link>
          <Link href="/hackathon/projects" className="ow-btn ow-btn-ghost no-underline">
            Browse the wall
          </Link>
          <button type="button" className="ow-btn ow-btn-ghost" onClick={onAnother}>
            Register a friend
          </button>
        </div>

        <p style={{ marginTop: 64, fontSize: '0.8125rem', color: 'var(--ow-ink-3)' }}>
          Share this page only if you want company. Weirdness multiplies. It is not a virus but it behaves like one.
        </p>

        <style>{`
          @media (max-width: 700px) {
            .ow-admitted-card { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

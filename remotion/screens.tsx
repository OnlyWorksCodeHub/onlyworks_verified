import React from 'react'
import { LayoutGrid, MessageSquare, Star, BarChart3, Check, ChevronDown, Shield, Search } from 'lucide-react'

const serif = 'Instrument Serif, Georgia, serif'

/* faithful recreation of the OnlyWorks desktop UI (real data) for the ad */
export const SCREEN_W = 1320
export const SCREEN_H = 840

const S = {
  bg: '#0e0e12', rail: '#0a0a0d', panel: '#15151b', panel2: '#191920',
  border: 'rgba(255,255,255,0.07)', border2: 'rgba(255,255,255,0.12)',
  text: '#f3f3f6', mut: '#9a9aa4', dim: '#6a6a73',
  violet: '#8b5cf6', green: '#4ade80', amber: '#fbbf24', red: '#f87171',
}
const sans = 'Instrument Sans, system-ui, sans-serif'

const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: SCREEN_W, height: SCREEN_H, background: S.bg, display: 'flex', fontFamily: sans, color: S.text, overflow: 'hidden' }}>
    {children}
  </div>
)

const Side: React.FC<{ active: number }> = ({ active }) => {
  const icons = [LayoutGrid, MessageSquare, Star, BarChart3]
  return (
    <div style={{ width: 66, background: S.rail, borderRight: `1px solid ${S.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 18, gap: 10 }}>
      {icons.map((Ic, i) => (
        <div key={i} style={{ width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === active ? S.violet : 'transparent', color: i === active ? '#fff' : S.dim }}>
          <Ic size={20} />
        </div>
      ))}
      <div style={{ marginTop: 'auto', marginBottom: 18, width: 36, height: 36, borderRadius: '50%', background: '#1b1b21', border: `2px solid ${S.violet}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.mut, fontSize: 14, fontWeight: 600 }}>N</div>
    </div>
  )
}

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 11.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: S.dim, fontWeight: 600, ...style }}>{children}</div>
)

/* ───────── DASHBOARD ───────── */
const PRIORITIES = [
  'Further refine the product roadmap for the new OnlyWorks application based on the market analysis and codebase review.',
  'Explore the recommended graduate course options and enrollment procedures.',
  'Address the Claude Code auto-update failure to ensure access to the latest version of the tool.',
]
const ACCOMP = [
  ['Identified graduate program options and admission strategies.', 'A pathway for professional development through advanced education.'],
  ['Assessed product-market fit for the OnlyWorks application.', 'Informs strategic decisions about future development and positioning.'],
  ['Contributed to a UI fix for the active-session indicator.', 'Improves UX and code maintainability with consistent theming.'],
  ['Validated software-development skill profile in OnlyWorks.', 'Ensures accurate representation of skills for future work.'],
]
const SESSIONS = [
  ['Work Session 5/28/2026, 10:04 AM', 'May 28 at 10:04 AM', '46m'],
  ['Work Session 4/25/2026, 2:55 PM', 'Apr 25 at 2:55 PM', '1m'],
  ['Work Session 4/25/2026, 2:53 PM', 'Apr 25 at 2:53 PM', '1m'],
  ['Work Session 4/25/2026, 2:51 PM', 'Apr 25 at 2:51 PM', '4m'],
]

export const Dashboard: React.FC = () => (
  <Screen>
    <Side active={0} />
    <div style={{ flex: 1, padding: '26px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 27, fontWeight: 700 }}>Good morning, namkhaa</div>
          <div style={{ fontSize: 14, color: S.mut, marginTop: 4 }}>11:46 AM · Sunday, June 14, 2026</div>
        </div>
        <div style={{ background: S.violet, color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 20px', borderRadius: 10 }}>Start Session</div>
      </div>

      <div style={{ marginTop: 20, background: S.panel, border: `1px solid ${S.border}`, borderRadius: 14, padding: '16px 20px' }}>
        <Label style={{ marginBottom: 10 }}>Today&apos;s Priorities</Label>
        {PRIORITIES.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '6px 0' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(139,92,246,0.18)', color: S.violet, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{i + 1}</div>
            <div style={{ fontSize: 13.5, color: '#d7d7dd', lineHeight: 1.4 }}>{p}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 20, marginTop: 22 }}>
        <div>
          <Label style={{ marginBottom: 12 }}>Recent Accomplishments</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ACCOMP.map(([t, d], i) => (
              <div key={i} style={{ background: S.panel, border: `1px solid ${S.border}`, borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 12, color: S.mut, marginTop: 3, lineHeight: 1.4 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <Label>Recent Sessions</Label>
            <div style={{ fontSize: 12, color: S.violet, fontWeight: 600 }}>View All</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SESSIONS.map(([t, s, d], i) => (
              <div key={i} style={{ background: S.panel, border: `1px solid ${S.border}`, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                  <div style={{ fontSize: 11.5, color: S.dim, marginTop: 2 }}>{s}</div>
                </div>
                <div style={{ fontSize: 12, color: S.mut }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Screen>
)

/* ───────── REPORT ───────── */
const SKILLS_USED = ['Product-Market Fit Analysis', 'Codebase Review', 'AI-Assisted Research', 'Git Pull Request Review']
const STRENGTHS = [
  ['Problem Solving', 'Researched solutions for improving GPA and explored graduate program options.'],
  ['Code Review', 'Reviewed and merged a pull request related to UI theming.'],
  ['Research Synthesis', 'Synthesized information from Claude AI and codebase analysis to inform decisions.'],
]
export const Report: React.FC = () => (
  <Screen>
    <Side active={3} />
    <div style={{ flex: 1, padding: '28px 34px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Tasks</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, marginBottom: 26 }}>
        <div>
          <Label style={{ color: S.green, marginBottom: 10 }}>Completed</Label>
          {['Merged pull request fix(ui): use theme tokens for status colors and fix active-session dot #34', 'Initial codebase review and market analysis for the OnlyWorks desktop application'].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0' }}>
              <Check size={16} color={S.green} style={{ marginTop: 2, flex: '0 0 auto' }} />
              <div style={{ fontSize: 13, color: '#d7d7dd', lineHeight: 1.4 }}>{t}</div>
            </div>
          ))}
        </div>
        <div>
          <Label style={{ color: S.amber, marginBottom: 10 }}>Remaining</Label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '6px 0' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${S.amber}`, marginTop: 3, flex: '0 0 auto' }} />
              <div style={{ fontSize: 13, color: '#d7d7dd', lineHeight: 1.4 }}>Finalize product requirements for OnlyWorks</div>
            </div>
            <div style={{ fontSize: 11, color: S.red, fontWeight: 700, letterSpacing: '0.08em' }}>HIGH</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Skills Used</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
        {SKILLS_USED.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${S.border2}`, borderRadius: 9, padding: '8px 12px' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
            <span style={{ fontSize: 11, color: S.violet }}>intermediate</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Strengths Demonstrated</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {STRENGTHS.map(([t, d], i) => (
          <div key={i} style={{ background: S.panel, border: `1px solid ${S.border}`, borderLeft: `3px solid ${S.violet}`, borderRadius: 10, padding: '13px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: S.mut, marginTop: 3, lineHeight: 1.4 }}>{d}</div>
            </div>
            <div style={{ fontSize: 12, color: S.amber, flex: '0 0 auto', marginLeft: 16 }}>Occasional</div>
          </div>
        ))}
      </div>
    </div>
  </Screen>
)

/* ───────── VERIFIED PROFILE ───────── */
const PSKILLS: [string, string][] = [
  ['Electron Application Development', 'ADVANCED'],
  ['JavaScript Debugging', 'ADVANCED'],
  ['SQL Schema Design', 'INTERMEDIATE'],
  ['Algorithmic Optimization', 'INTERMEDIATE'],
  ['Exception Handling', 'INTERMEDIATE'],
  ['Markdown', 'INTERMEDIATE'],
  ['Debugging', 'INTERMEDIATE'],
  ['macOS Package Management', 'EMERGING'],
  ['VS Code Debugging', 'INTERMEDIATE'],
]
const levelColor = (l: string) => (l === 'ADVANCED' ? S.green : l === 'EMERGING' ? S.amber : '#bcbcc6')
export const Profile: React.FC = () => (
  <Screen>
    <Side active={3} />
    <div style={{ flex: 1, padding: '26px 34px' }}>
      <div style={{ fontSize: 26, fontWeight: 700 }}>Namkha oedzer</div>
      <div style={{ fontSize: 13, color: S.dim, marginTop: 2 }}>OW-H5F2L</div>
      <div style={{ fontSize: 14, color: S.violet, fontWeight: 600, marginTop: 4 }}>Software Development</div>
      <div style={{ fontSize: 13, color: S.mut, marginTop: 6 }}>27 verified skills · 3 advanced · 23 reports analyzed</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <div style={{ background: S.violet, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 999 }}>OW Profile</div>
        <div style={{ color: S.mut, fontSize: 13, padding: '8px 16px', borderRadius: 999, border: `1px solid ${S.border2}` }}>Resume</div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Label>Verified Skills</Label>
        <div style={{ fontSize: 13, color: S.mut, marginTop: 4 }}>Skills detected and verified from real work activity across 23 reports.</div>
      </div>

      <Label style={{ marginTop: 18, marginBottom: 4 }}>Technical</Label>
      <div>
        {PSKILLS.map(([name, lvl], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 4px', borderBottom: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 14.5, fontWeight: 500 }}>{name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.07em', color: levelColor(lvl) }}>{lvl}</div>
              <ChevronDown size={18} color={S.dim} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Screen>
)

/* ───────── HIRING-MANAGER SIDE (the website, light) ───────── */
const L = { bg: '#fafaf9', card: '#ffffff', chrome: '#efece6', border: '#e3e0d9', text: '#080503', mut: '#57554f', dim: '#a3a19b', violet: '#8b5cf6' }
const CANDS = [
  { in: 'MR', name: 'Maya R.', role: 'Frontend Engineer', skills: ['React', 'TypeScript', 'Figma'], match: 96, sel: true },
  { in: 'DK', name: 'Daniel K.', role: 'Full-Stack Developer', skills: ['Node.js', 'PostgreSQL', 'AWS'], match: 91, sel: false },
  { in: 'ST', name: 'Sofia T.', role: 'Product Designer', skills: ['Figma', 'Design Systems', 'Prototyping'], match: 88, sel: false },
]
export const HiringSearch: React.FC = () => (
  <div style={{ width: SCREEN_W, height: SCREEN_H, background: L.bg, fontFamily: sans, color: L.text, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    <div style={{ height: 48, background: L.chrome, borderBottom: `1px solid ${L.border}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px' }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: '#d4d0c8' }} />)}
      <div style={{ marginLeft: 16, width: 380, background: '#fff', border: `1px solid ${L.border}`, borderRadius: 8, padding: '7px 14px', fontSize: 13, color: L.mut, textAlign: 'center' }}>only-works.com/search</div>
    </div>
    <div style={{ padding: '30px 44px', flex: 1 }}>
      <div style={{ fontFamily: serif, fontSize: 38, letterSpacing: '-0.01em' }}>Find verified talent</div>
      <div style={{ fontSize: 14, color: L.mut, marginTop: 4 }}>Search candidates by the skills they actually demonstrated.</div>
      <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `1px solid ${L.border}`, borderRadius: 11, padding: '12px 16px' }}>
          <Search size={18} color={L.dim} />
          <span style={{ fontSize: 14.5, color: L.text }}>React · TypeScript</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 11, border: `1px solid ${L.border}`, background: '#fff', fontSize: 14, color: L.text }}>
          <Shield size={16} color={L.violet} /> Verified only
        </div>
        <div style={{ background: L.violet, color: '#fff', fontSize: 14.5, fontWeight: 600, padding: '12px 24px', borderRadius: 11 }}>Search</div>
      </div>
      <div style={{ fontSize: 13, color: L.dim, margin: '20px 0 12px' }}>3 verified candidates found</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CANDS.map((c, i) => (
          <div key={i} style={{ background: L.card, border: c.sel ? `1.5px solid ${L.violet}` : `1px solid ${L.border}`, borderRadius: 14, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: c.sel ? '0 10px 34px rgba(139,92,246,0.16)' : '0 1px 2px rgba(0,0,0,0.03)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: '#fff', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>{c.in}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontSize: 13, color: L.mut, marginBottom: 8 }}>{c.role}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {c.skills.map((s, j) => (
                  <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: L.text, border: `1px solid ${L.violet}44`, borderRadius: 7, padding: '4px 9px' }}>
                    <Shield size={12} color={L.violet} />{s}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: L.violet }}>{c.match}%</div>
              <div style={{ fontSize: 11, color: L.dim, letterSpacing: '0.04em' }}>match</div>
            </div>
            <div style={{ flex: '0 0 auto', padding: '10px 20px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, ...(c.sel ? { background: L.violet, color: '#fff' } : { border: `1px solid ${L.border}`, color: L.text }) }}>
              {c.sel ? 'Reach out' : 'View profile'}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

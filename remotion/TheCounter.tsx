import React from 'react'
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Easing,
} from 'remotion'
import { loadFont as loadSerif } from '@remotion/google-fonts/InstrumentSerif'
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono'
import { loadFont as loadSans } from '@remotion/google-fonts/InstrumentSans'
import { Dashboard, Report, Profile, HiringSearch, SCREEN_W, SCREEN_H } from './screens'

const serif = loadSerif().fontFamily
const mono = loadMono().fontFamily
const sans = loadSans().fontFamily

/* LIGHT theme — consistent with the website */
const BG = '#fafaf9'
const TX = '#080503'
const VIOLET = '#8b5cf6'
const MUT = '#57554f'
const DIM = '#a3a19b'

function useU() {
  const { width, height } = useVideoConfig()
  return Math.min(width, height) / 100
}
/* a touch slower than before */
function rise(frame: number, delay = 0, dur = 22) {
  const o = interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const y = interpolate(frame, [delay, delay + dur], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  return { opacity: o, transform: `translateY(${y}px)` }
}

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: BG, alignItems: 'center', justifyContent: 'center', fontFamily: sans }}>{children}</AbsoluteFill>
)
const Eyebrow: React.FC<{ children: React.ReactNode; u: number; style?: React.CSSProperties }> = ({ children, u, style }) => (
  <div style={{ fontFamily: mono, fontSize: 1.7 * u, letterSpacing: '0.32em', textTransform: 'uppercase', color: DIM, ...style }}>{children}</div>
)

/* framed product screen on the light bg (dark app windows + the light hiring view) */
const ScreenFrame: React.FC<{ children: React.ReactNode; frame: number }> = ({ children, frame }) => {
  const { width, height } = useVideoConfig()
  const targetW = Math.min(width * 0.94, height * 0.58 * (SCREEN_W / SCREEN_H))
  const scale = targetW / SCREEN_W
  const z = interpolate(frame, [0, 150], [1.0, 1.035], { extrapolateRight: 'clamp' })
  const r = rise(frame, 0, 24)
  return (
    <div style={{ opacity: r.opacity, width: targetW, height: SCREEN_H * scale, borderRadius: targetW * 0.018, overflow: 'hidden', border: '1px solid rgba(8,5,3,0.1)', boxShadow: '0 36px 90px rgba(8,5,3,0.16)', transform: `${r.transform} scale(${z})` }}>
      <div style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}
const Caption: React.FC<{ frame: number; u: number; delay?: number; children: React.ReactNode }> = ({ frame, u, delay = 28, children }) => (
  <div style={{ ...rise(frame, delay, 20), position: 'absolute', bottom: '8%', width: '86%', textAlign: 'center', fontFamily: serif, fontSize: 6.2 * u, color: TX, lineHeight: 1.08 }}>{children}</div>
)

/* ── 1. counter (to 130) ── */
const SceneCounter: React.FC = () => {
  const frame = useCurrentFrame(); const u = useU()
  const n = Math.floor(interpolate(frame, [0, 150], [47, 131], { extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) }))
  const pulse = 1 + 0.012 * Math.sin(frame / 2)
  return (
    <Stage>
      <div style={{ textAlign: 'center', ...rise(frame, 4, 20) }}>
        <Eyebrow u={u}>Applications sent</Eyebrow>
        <div style={{ fontFamily: serif, color: TX, fontSize: 40 * u, lineHeight: 1, marginTop: 2 * u, transform: `scale(${pulse})`, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
        <div style={{ fontFamily: mono, color: DIM, fontSize: 3 * u, letterSpacing: '0.06em', marginTop: 4 * u }}>0 replies</div>
      </div>
    </Stage>
  )
}

/* ── 2. everyone's résumé is the same ── */
const BUZZ = ['Results-driven self-starter.', 'Synergy. Impact. 10×.', 'Passionate about excellence.', 'Spearheaded cross-functional growth.']
const SceneGeneric: React.FC = () => {
  const frame = useCurrentFrame(); const u = useU()
  return (
    <Stage>
      <div style={{ width: '82%', maxWidth: 70 * u, display: 'flex', flexDirection: 'column', gap: 1.4 * u }}>
        {BUZZ.map((b, i) => (
          <div key={i} style={{ ...rise(frame, i * 9, 18), fontFamily: mono, fontSize: 2.6 * u, color: '#8a8880', borderLeft: '2px solid rgba(8,5,3,0.12)', paddingLeft: 2 * u }}>{b}</div>
        ))}
      </div>
      <div style={{ ...rise(frame, 42, 20), position: 'absolute', bottom: '16%', width: '84%', textAlign: 'center', fontFamily: serif, fontSize: 7 * u, color: TX, lineHeight: 1.05 }}>
        Everyone&apos;s résumé says the same thing.
      </div>
    </Stage>
  )
}

/* ── 3. the turn ── */
const SceneTurn: React.FC = () => {
  const frame = useCurrentFrame(); const u = useU()
  return (
    <Stage>
      <div style={{ width: '84%', textAlign: 'center' }}>
        <div style={{ ...rise(frame, 4, 20), fontFamily: serif, fontSize: 8.5 * u, color: TX, lineHeight: 1.04 }}>It&apos;s not that you&apos;re not good enough.</div>
        <div style={{ ...rise(frame, 34, 20), fontFamily: serif, fontSize: 8.5 * u, color: VIOLET, lineHeight: 1.04, marginTop: 2.5 * u }}>It&apos;s that no one can tell.</div>
      </div>
    </Stage>
  )
}

/* ── 4-6. job-seeker product (real recreated dark app) ── */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame(); const u = useU()
  return (
    <Stage>
      <Eyebrow u={u} style={{ position: 'absolute', top: '11%', color: VIOLET }}>Meet OnlyWorks</Eyebrow>
      <ScreenFrame frame={frame}><Dashboard /></ScreenFrame>
      <Caption frame={frame} u={u}>You do the work. <span style={{ color: VIOLET }}>It captures it.</span></Caption>
    </Stage>
  )
}
const SceneReport: React.FC = () => {
  const frame = useCurrentFrame(); const u = useU()
  return (
    <Stage>
      <ScreenFrame frame={frame}><Report /></ScreenFrame>
      <Caption frame={frame} u={u}>Then it writes the <span style={{ color: VIOLET }}>proof.</span></Caption>
    </Stage>
  )
}
const SceneProfile: React.FC = () => {
  const frame = useCurrentFrame(); const u = useU()
  return (
    <Stage>
      <ScreenFrame frame={frame}><Profile /></ScreenFrame>
      <Caption frame={frame} u={u}>27 skills, <span style={{ color: VIOLET }}>verified from real work.</span></Caption>
    </Stage>
  )
}

/* ── 7. employer side (the website) ── */
const SceneHiring: React.FC = () => {
  const frame = useCurrentFrame(); const u = useU()
  return (
    <Stage>
      <Eyebrow u={u} style={{ position: 'absolute', top: '11%', color: VIOLET }}>For employers</Eyebrow>
      <ScreenFrame frame={frame}><HiringSearch /></ScreenFrame>
      <Caption frame={frame} u={u}>And employers <span style={{ color: VIOLET }}>find you</span> — and reach out.</Caption>
    </Stage>
  )
}

/* ── 8. reply + end card ── */
const SceneEnd: React.FC = () => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const u = useU()
  const flip = frame > 24
  const pop = spring({ frame: frame - 24, fps, config: { damping: 12, stiffness: 160 } })
  return (
    <Stage>
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...rise(frame, 2, 16), fontFamily: mono, fontSize: 3 * u, letterSpacing: '0.06em', color: flip ? VIOLET : DIM, transform: flip ? `scale(${0.9 + 0.2 * pop})` : 'none' }}>{flip ? '1 reply' : '0 replies'}</div>
        <div style={{ ...rise(frame, 16, 18), marginTop: 6 * u }}>
          <div style={{ fontFamily: serif, fontSize: 11 * u, color: TX, lineHeight: 1 }}>OnlyWorks</div>
          <div style={{ fontFamily: sans, fontSize: 2.8 * u, color: MUT, marginTop: 2 * u }}>Proof of real work, not résumés.</div>
          <div style={{ display: 'inline-block', marginTop: 4 * u, padding: `${1.6 * u}px ${3.4 * u}px`, borderRadius: 999, background: VIOLET, color: '#fff', fontFamily: sans, fontSize: 2.6 * u, fontWeight: 600 }}>Download free</div>
        </div>
      </div>
    </Stage>
  )
}

export const TheCounter: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence durationInFrames={165}><SceneCounter /></Sequence>
    <Sequence from={165} durationInFrames={115}><SceneGeneric /></Sequence>
    <Sequence from={280} durationInFrames={95}><SceneTurn /></Sequence>
    <Sequence from={375} durationInFrames={120}><SceneDashboard /></Sequence>
    <Sequence from={495} durationInFrames={105}><SceneReport /></Sequence>
    <Sequence from={600} durationInFrames={105}><SceneProfile /></Sequence>
    <Sequence from={705} durationInFrames={120}><SceneHiring /></Sequence>
    <Sequence from={825} durationInFrames={75}><SceneEnd /></Sequence>
  </AbsoluteFill>
)

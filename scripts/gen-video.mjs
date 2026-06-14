#!/usr/bin/env node
/**
 * gen-video.mjs — generate OnlyWorks ad clips via the Replicate API.
 *
 * Reads REPLICATE_API_TOKEN from .env.local (never commit it).
 * Usage:
 *   node scripts/gen-video.mjs                 # all shots, default model
 *   node scripts/gen-video.mjs --shot 3        # only shot #3 (1-based)
 *   node scripts/gen-video.mjs --model google/veo-3-fast
 *   node scripts/gen-video.mjs --aspect 9:16   # social cut (veo/seedance only)
 *
 * Output: public/videos/<name>.mp4
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUTDIR = join(ROOT, 'public', 'videos')

/* ── read token from .env.local without printing it ── */
function loadToken() {
  const p = join(ROOT, '.env.local')
  if (!existsSync(p)) throw new Error('.env.local not found')
  const line = readFileSync(p, 'utf8').split('\n').find(l => l.startsWith('REPLICATE_API_TOKEN='))
  const tok = line?.slice('REPLICATE_API_TOKEN='.length).trim().replace(/^["']|["']$/g, '')
  if (!tok) throw new Error('REPLICATE_API_TOKEN missing/empty in .env.local')
  return tok
}

/* ── CLI args ── */
const args = process.argv.slice(2)
const getArg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
const MODEL = getArg('--model', 'google/veo-3-fast') // top-quality text-to-video; --model bytedance/seedance-1-pro for cheaper
const ASPECT = getArg('--aspect', '16:9')
const ONLY = getArg('--shot', null) ? parseInt(getArg('--shot'), 10) : null

const NEG = 'text, words, captions, watermark, logo, app UI, user interface, screen recording, faces, low quality, blurry, distorted, deformed'

/* ── the ad shots (shot 3 doubles as the homepage brand-band clip) ── */
const SHOTS = [
  {
    name: 'recruiter-sea',
    prompt: 'Cinematic over-the-shoulder shot of a tired recruiter sitting in a dark office at night, facing a wall of several glowing monitors. Every screen is filled with endless scrolling grids of nearly identical résumés and applicant cards — uniform, beige, faceless, blurring together, none standing out. The recruiter slumps, rubs their eyes, scrolls endlessly. Cold blue screen-light on a weary face, sterile office, overwhelming monotony, slow push-in. Moody, desaturated, high-end commercial cinematography. No readable text, no logos, no recognizable app interface.',
  },
  {
    name: 'resume-wall-proof',
    prompt: 'A towering wall of hundreds of identical beige paper résumés in a cold grey void collapses into a slow-motion cloud of fine paper dust. From the drifting dust, warm light gathers and a single clean card materializes and assembles in the centre of the frame, an electric-violet line of light drawing across it. Cinematic, high-contrast, cold-to-warm transition, shallow depth of field, dramatic and hopeful. No readable text, no logos, no UI.',
  },
]

function buildInput(model, prompt) {
  if (model.startsWith('google/veo-3')) return { prompt, aspect_ratio: ASPECT, resolution: '1080p', duration: 8, generate_audio: false, negative_prompt: NEG }
  if (model.startsWith('kwaivgi/kling')) return { prompt, duration: 5, mode: 'standard', negative_prompt: NEG }
  if (model.startsWith('bytedance/seedance')) return { prompt, aspect_ratio: ASPECT, resolution: '1080p', duration: 5 }
  if (model.startsWith('minimax/')) return { prompt, duration: 6, resolution: '1080p' }
  return { prompt }
}

const TOKEN = loadToken()
const H = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generate(shot) {
  process.stdout.write(`\n▶ ${shot.name} via ${MODEL} … `)
  const res = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    method: 'POST', headers: H, body: JSON.stringify({ input: buildInput(MODEL, shot.prompt) }),
  })
  if (!res.ok) { console.log('FAILED to start:', res.status, await res.text()); return null }
  let pred = await res.json()
  const pollUrl = pred.urls?.get
  const t0 = Date.now()
  while (!['succeeded', 'failed', 'canceled'].includes(pred.status)) {
    if (Date.now() - t0 > 12 * 60 * 1000) { console.log('TIMEOUT'); return null }
    await sleep(3000)
    pred = await (await fetch(pollUrl, { headers: H })).json()
    process.stdout.write('.')
  }
  if (pred.status !== 'succeeded') { console.log(`\n  ${pred.status}:`, JSON.stringify(pred.error)); return null }
  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  mkdirSync(OUTDIR, { recursive: true })
  const out = join(OUTDIR, `${shot.name}.mp4`)
  writeFileSync(out, buf)
  const secs = ((Date.now() - t0) / 1000).toFixed(0)
  console.log(`\n  ✓ saved public/videos/${shot.name}.mp4 (${(buf.length / 1e6).toFixed(1)} MB, ${secs}s)`)
  return out
}

const todo = ONLY ? [SHOTS[ONLY - 1]].filter(Boolean) : SHOTS
console.log(`Model: ${MODEL} · aspect: ${ASPECT} · shots: ${todo.map(s => s.name).join(', ')}`)
for (const shot of todo) await generate(shot)
console.log('\nDone.')

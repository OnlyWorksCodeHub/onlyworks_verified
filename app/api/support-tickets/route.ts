import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { APP_URL } from '@/lib/config'
import {
  SUPPORT_BUCKET,
  TICKET_CATEGORY_VALUES,
  ticketCategoryLabel,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  MAX_TOTAL_BYTES,
  MAX_NAME_LEN,
  MAX_SUBJECT_LEN,
  MAX_MESSAGE_LEN,
  isAllowedAttachmentType,
  type TicketAttachment,
} from '@/lib/support/tickets'

export const runtime = 'nodejs'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const REF_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // no easily-confused chars
const SUPPORT_INBOX = 'support@only-works.com'
// Paths minted by /api/support-tickets/attachment-url look like
// `tickets/<hex>/<safe-name>`. Anything else is rejected.
const ATTACHMENT_PATH_RE = /^tickets\/[a-f0-9]{8,}\/[A-Za-z0-9._-]+$/

function makeRef(): string {
  const bytes = randomBytes(6)
  let s = ''
  for (let i = 0; i < 6; i++) s += REF_CHARS[bytes[i] % REF_CHARS.length]
  return `TKT-${s}`
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function teamEmailHtml(t: {
  ref: string
  email: string
  name: string | null
  category: string
  subject: string
  message: string
  attachmentCount: number
  ow_id: string | null
}): string {
  const meta = [
    `<strong>From:</strong> ${escapeHtml(t.name || 'Anonymous')} &lt;${escapeHtml(t.email)}&gt;`,
    `<strong>Category:</strong> ${escapeHtml(ticketCategoryLabel(t.category))}`,
    t.ow_id ? `<strong>OW ID:</strong> ${escapeHtml(t.ow_id)}` : '',
    `<strong>Attachments:</strong> ${t.attachmentCount}`,
  ].filter(Boolean).join('<br />')
  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1ece2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1c1b18;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="border:2px solid #1c1b18;padding:32px;background:#f1ece2;">
      <p style="margin:0;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;color:#807d72;">New support ticket</p>
      <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;">${escapeHtml(t.subject)}</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#807d72;font-family:monospace;">${escapeHtml(t.ref)}</p>
      <p style="margin:20px 0 0;font-size:13px;line-height:1.7;color:#4a4842;">${meta}</p>
      <div style="margin:20px 0 0;padding:16px;border:1px solid #dad7d0;background:#fffdf8;font-size:14px;line-height:1.6;color:#1c1b18;white-space:pre-wrap;">${escapeHtml(t.message)}</div>
      <p style="margin:24px 0 0;font-size:14px;">
        <a href="${APP_URL}/admin/tickets" style="color:#7c3aed;font-weight:600;">Open in the triage dashboard &rarr;</a>
      </p>
    </div>
  </div>
</body></html>`
}

// Best-effort team notification. Resend v6 reports failures via the resolved
// { error } field (it doesn't throw) and has no built-in timeout, so we bound it.
async function notifyTeam(payload: Parameters<typeof teamEmailHtml>[0]): Promise<void> {
  if (!process.env.RESEND_API_KEY) return
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await Promise.race([
      resend.emails.send({
        from: 'OnlyWorks Support <noreply@only-works.com>',
        to: SUPPORT_INBOX,
        replyTo: payload.email,
        subject: `[${payload.ref}] ${payload.subject.replace(/[\r\n]+/g, ' ')}`,
        html: teamEmailHtml(payload),
      }),
      new Promise<{ error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ error: { message: 'send timed out after 5s' } }), 5000),
      ),
    ])
    if (result.error) console.error('Support ticket team notification failed:', result.error)
  } catch (err) {
    console.error('Support ticket team notification failed:', err)
  }
}

interface IncomingAttachment {
  path: string
  name: string
  type: string
  size: number
}

export async function POST(request: NextRequest) {
  try {
    let body: {
      name?: string
      email?: string
      category?: string
      subject?: string
      message?: string
      app_version?: string
      ow_id?: string
      attachments?: unknown
    }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const name = String(body.name || '').trim().slice(0, MAX_NAME_LEN)
    const email = String(body.email || '').trim().toLowerCase()
    const subject = String(body.subject || '').trim().slice(0, MAX_SUBJECT_LEN)
    const message = String(body.message || '').trim().slice(0, MAX_MESSAGE_LEN)
    const appVersion = String(body.app_version || '').trim().slice(0, 60) || null
    const categoryRaw = String(body.category || '').trim()
    const category = TICKET_CATEGORY_VALUES.includes(categoryRaw) ? categoryRaw : 'bug'

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    }
    if (!subject) {
      return NextResponse.json({ error: 'A short subject is required.' }, { status: 400 })
    }
    if (!message) {
      return NextResponse.json({ error: 'Please describe what happened.' }, { status: 400 })
    }

    // ── Validate the claimed attachments ──────────────────────────────────────
    const rawAttachments: IncomingAttachment[] = Array.isArray(body.attachments)
      ? (body.attachments as IncomingAttachment[])
      : []
    if (rawAttachments.length > MAX_ATTACHMENTS) {
      return NextResponse.json(
        { error: `Too many files — ${MAX_ATTACHMENTS} max.` },
        { status: 400 },
      )
    }

    const supabase = getSupabaseAdmin()

    // Synchronous validation first (no I/O) so an over-limit request is rejected
    // before any storage round-trip.
    const candidates: TicketAttachment[] = []
    let totalBytes = 0
    for (const a of rawAttachments) {
      const path = String(a?.path || '')
      const type = String(a?.type || '').toLowerCase()
      const size = Number(a?.size || 0)
      const fileName = String(a?.name || 'attachment').slice(0, 200)

      if (!ATTACHMENT_PATH_RE.test(path) || !isAllowedAttachmentType(type)) {
        return NextResponse.json({ error: 'An attachment was invalid. Remove it and retry.' }, { status: 400 })
      }
      if (!Number.isFinite(size) || size < 0 || size > MAX_ATTACHMENT_BYTES) {
        return NextResponse.json({ error: 'An attachment is too large.' }, { status: 400 })
      }
      totalBytes += size
      if (totalBytes > MAX_TOTAL_BYTES) {
        return NextResponse.json({ error: 'Attachments are too large in total.' }, { status: 400 })
      }
      candidates.push({ path, name: fileName, type, size })
    }

    // Confirm every claimed object actually landed (the browser uploads directly,
    // so a claimed path with no object means the upload never completed). Probe
    // them concurrently.
    const probes = await Promise.all(
      candidates.map((c) => supabase.storage.from(SUPPORT_BUCKET).createSignedUrl(c.path, 60)),
    )
    if (probes.some((p) => p.error)) {
      return NextResponse.json(
        { error: 'An attachment did not finish uploading. Remove it and retry.' },
        { status: 400 },
      )
    }
    const attachments = candidates

    // ── Attach signed-in identity (read from the verified user, not the body) ───
    let userId: string | null = null
    let owId: string | null = String(body.ow_id || '').trim() || null
    try {
      // getUser() verifies the JWT with the Auth server; getSession() would trust
      // a forgeable cookie. This value is persisted as the submitter identity.
      const { data } = await createClient().auth.getUser()
      if (data.user) {
        userId = data.user.id
        const metaOw = data.user.user_metadata?.ow_id
        if (typeof metaOw === 'string' && metaOw) owId = metaOw
      }
    } catch {
      // anonymous submission — fine
    }

    const userAgent = request.headers.get('user-agent')?.slice(0, 400) || null

    // ── Insert (regenerate ref on the astronomically-unlikely unique collision) ─
    const row: Record<string, unknown> = {
      ref: makeRef(),
      name: name || null,
      email,
      category,
      subject,
      message,
      attachments,
      app_version: appVersion,
      user_id: userId,
      ow_id: owId,
      user_agent: userAgent,
    }

    let inserted: { ref: string } | null = null
    let insertError: { code?: string; message?: string } | null = null
    for (let attempt = 0; attempt < 4; attempt++) {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert(row)
        .select('ref')
        .single()
      if (!error) {
        inserted = data
        break
      }
      insertError = error
      if (error.code === '23505') {
        row.ref = makeRef()
        continue
      }
      break
    }

    if (!inserted) {
      console.error('Support ticket insert failed:', insertError)
      // Best-effort: clean up the orphaned uploads so they don't linger.
      if (attachments.length) {
        await supabase.storage.from(SUPPORT_BUCKET).remove(attachments.map((a) => a.path)).catch(() => {})
      }
      return NextResponse.json(
        { error: 'Could not save your ticket right now. Try again in a moment.' },
        { status: 503 },
      )
    }

    await notifyTeam({
      ref: inserted.ref,
      email,
      name: name || null,
      category,
      subject,
      message,
      attachmentCount: attachments.length,
      ow_id: owId,
    })

    return NextResponse.json({ success: true, ref: inserted.ref })
  } catch (error) {
    console.error('Support ticket error:', error)
    return NextResponse.json({ error: 'Could not submit your ticket.' }, { status: 500 })
  }
}

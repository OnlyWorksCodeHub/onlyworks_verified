import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import {
  SUPPORT_BUCKET,
  MAX_ATTACHMENT_BYTES,
  isAllowedAttachmentType,
} from '@/lib/support/tickets'

export const runtime = 'nodejs'

// Mints a one-time signed upload URL so the browser can push an attachment
// straight into the private bucket (bypassing the serverless request-body limit).
// The actual file bytes never pass through this function.
export async function POST(request: NextRequest) {
  try {
    let body: { name?: string; type?: string; size?: number }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const name = String(body.name || '').trim()
    const type = String(body.type || '').trim().toLowerCase()
    const size = Number(body.size || 0)

    if (!name) {
      return NextResponse.json({ error: 'A file name is required.' }, { status: 400 })
    }
    if (!isAllowedAttachmentType(type)) {
      return NextResponse.json(
        { error: 'Only image and video files can be attached.' },
        { status: 400 },
      )
    }
    if (!Number.isFinite(size) || size <= 0 || size > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json(
        { error: `Each file must be under ${Math.round(MAX_ATTACHMENT_BYTES / 1024 / 1024)} MB.` },
        { status: 400 },
      )
    }

    // Sanitise the filename and give each upload its own random folder so paths
    // are unguessable and submissions can't collide.
    const safe = (name.split(/[\\/]/).pop() || 'file')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(-80) || 'file'
    const path = `tickets/${randomBytes(12).toString('hex')}/${safe}`

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
      .from(SUPPORT_BUCKET)
      .createSignedUploadUrl(path)

    if (error || !data) {
      const missingBucket = /bucket.*not.*found|not found/i.test(error?.message || '')
      console.error('Signed upload URL failed:', error)
      return NextResponse.json(
        {
          error: missingBucket
            ? 'Attachment storage is not set up yet — you can still send the ticket without files, or email support@only-works.com.'
            : 'Could not prepare the upload. Try again in a moment.',
        },
        { status: missingBucket ? 503 : 502 },
      )
    }

    return NextResponse.json({ path: data.path, token: data.token })
  } catch (error) {
    console.error('attachment-url error:', error)
    return NextResponse.json({ error: 'Could not prepare the upload.' }, { status: 500 })
  }
}

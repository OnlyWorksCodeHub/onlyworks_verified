import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/auth'
import {
  SUPPORT_BUCKET,
  TICKET_STATUSES,
  type SupportTicket,
  type TicketAttachment,
  type TicketAttachmentSigned,
} from '@/lib/support/tickets'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // reads auth cookies; never statically optimized

const SIGNED_URL_TTL = 60 * 60 // 1 hour

export async function GET(req: NextRequest) {
  try {
    // Any signed-in user may triage tickets (not just ADMIN_EMAILS).
    const { error: authError } = await requireAuth()
    if (authError) return authError

    const supabase = getSupabaseAdmin()
    const status = req.nextUrl.searchParams.get('status')

    let query = supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)

    if (status && status !== 'all' && (TICKET_STATUSES as readonly string[]).includes(status)) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching support tickets:', error)
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
    }

    const tickets = (data || []) as SupportTicket[]

    // Mint short-lived signed view URLs for every attachment across ALL tickets
    // in a few batched calls (not one request per ticket), then map back by path.
    // Keeps a busy "all" view from fanning out hundreds of concurrent storage calls.
    const allPaths = tickets.flatMap((t) =>
      (Array.isArray(t.attachments) ? t.attachments : []).map((a) => a.path),
    )
    const urlByPath = new Map<string, string>()
    const CHUNK = 100
    for (let i = 0; i < allPaths.length; i += CHUNK) {
      const { data: urls } = await supabase.storage
        .from(SUPPORT_BUCKET)
        .createSignedUrls(allPaths.slice(i, i + CHUNK), SIGNED_URL_TTL)
      if (urls) {
        for (const u of urls) {
          if (u.path && u.signedUrl && !u.error) urlByPath.set(u.path, u.signedUrl)
        }
      }
    }

    const ticketsWithUrls = tickets.map((t) => {
      const attachments: TicketAttachment[] = Array.isArray(t.attachments) ? t.attachments : []
      const signed: TicketAttachmentSigned[] = attachments.map((a) => ({
        ...a,
        signedUrl: urlByPath.get(a.path) ?? null,
      }))
      return { ...t, attachments: signed }
    })

    return NextResponse.json({ success: true, count: ticketsWithUrls.length, tickets: ticketsWithUrls })
  } catch (error) {
    console.error('Unexpected error fetching tickets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

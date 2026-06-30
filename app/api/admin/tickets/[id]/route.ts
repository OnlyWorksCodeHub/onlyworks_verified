import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { TICKET_STATUSES, TICKET_PRIORITIES } from '@/lib/support/tickets'

export const runtime = 'nodejs'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return authError

    const id = params.id
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: 'Invalid ticket id' }, { status: 400 })
    }

    let body: { status?: string; priority?: string; admin_notes?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }

    if (body.status !== undefined) {
      if (!(TICKET_STATUSES as readonly string[]).includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      update.status = body.status
    }
    if (body.priority !== undefined) {
      if (!(TICKET_PRIORITIES as readonly string[]).includes(body.priority)) {
        return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })
      }
      update.priority = body.priority
    }
    if (body.admin_notes !== undefined) {
      if (typeof body.admin_notes !== 'string') {
        return NextResponse.json({ error: 'Invalid notes' }, { status: 400 })
      }
      update.admin_notes = body.admin_notes.slice(0, 5000) || null
    }

    // Nothing to change besides the timestamp → reject so the UI doesn't no-op silently.
    if (Object.keys(update).length === 1) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .update(update)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
      }
      console.error('Error updating ticket:', error)
      return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket: data })
  } catch (error) {
    console.error('Unexpected error updating ticket:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

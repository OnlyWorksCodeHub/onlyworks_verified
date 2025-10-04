import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reportId, action, expiresInDays = 30 } = body

    if (!reportId || !action) {
      return NextResponse.json(
        { error: 'reportId and action are required' },
        { status: 400 }
      )
    }

    if (action === 'share') {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)

      const { data, error } = await supabase
        .from('reports')
        .update({
          shared_at: new Date().toISOString(),
          share_expires_at: expiresAt.toISOString()
        })
        .eq('id', reportId)
        .eq('user_id', user.id)
        .select('share_token')
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to share report' },
          { status: 500 }
        )
      }

      return NextResponse.json({ shareToken: data.share_token })

    } else if (action === 'unshare') {
      const { error } = await supabase
        .from('reports')
        .update({
          shared_at: null,
          share_expires_at: null
        })
        .eq('id', reportId)
        .eq('user_id', user.id)

      if (error) {
        return NextResponse.json(
          { error: 'Failed to unshare report' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "share" or "unshare"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
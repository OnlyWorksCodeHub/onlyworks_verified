import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Code required' }, { status: 400 })
    }

    // Send to backend server
    const response = await fetch(`${BACKEND_URL}/api/access-codes/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code.trim() }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      // Extract error message - handle both string and object formats
      let errorMessage = 'Invalid access code'
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message
      }
      return NextResponse.json(
        { valid: false, error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      valid: data.valid ?? true,
      type: data.type || 'subscription',
      message: data.message || 'Access granted'
    })

  } catch (error) {
    console.error('Access code validation error:', error)
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 })
  }
}

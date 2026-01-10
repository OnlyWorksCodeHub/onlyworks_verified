import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://onlyworks-backend-server.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Send to backend server
    const response = await fetch(`${BACKEND_URL}/api/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      // Extract error message - handle both string and object formats
      let errorMessage = 'Failed to subscribe. Please try again.'
      if (typeof errorData.error === 'string') {
        errorMessage = errorData.error
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()

    console.log('Newsletter signup:', { email })

    return NextResponse.json(
      { message: data.message || 'Thanks for joining! We\'ll keep you updated.' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Newsletter signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

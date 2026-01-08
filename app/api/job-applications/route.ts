import { NextRequest, NextResponse } from 'next/server'

interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data: TurnstileResponse = await response.json()
    return data.success
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const turnstileToken = formData.get('turnstileToken') as string
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const linkedin = formData.get('linkedin') as string
    const portfolio = formData.get('portfolio') as string
    const message = formData.get('message') as string
    const resume = formData.get('resume') as File | null

    // Validate required fields
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Verification required' },
        { status: 400 }
      )
    }

    if (!name || !email || !jobId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken)

    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Process the application
    // In a real application, you would:
    // 1. Store the application in a database
    // 2. Upload the resume to cloud storage
    // 3. Send notification emails

    console.log('Job application received:', {
      jobId,
      jobTitle,
      name,
      email,
      linkedin,
      portfolio,
      message,
      hasResume: !!resume,
      resumeName: resume?.name,
      resumeSize: resume?.size,
    })

    // Example: Send notification email (if you have email service configured)
    // await sendApplicationNotification({ jobTitle, name, email, ... })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
    })
  } catch (error) {
    console.error('Job application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://onlyworks-backend-server.onrender.com'

interface TurnstileResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

async function verifyTurnstileToken(token: string): Promise<boolean> {
  // Skip verification in development or if no token
  if (!token) {
    return process.env.NODE_ENV === 'development'
  }

  try {
    // Verify directly with Cloudflare
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY || '',
        response: token,
      }),
    })

    if (!response.ok) {
      console.error('Turnstile API error:', response.status)
      return false
    }

    const data: TurnstileResponse = await response.json()
    return data.success
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return process.env.NODE_ENV === 'development'
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
    const phone = formData.get('phone') as string
    const linkedin = formData.get('linkedin') as string
    const portfolio = formData.get('portfolio') as string
    const coverLetter = formData.get('coverLetter') as string
    const resume = formData.get('resume') as File | null

    // Validate required fields
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

    // Prepare data for backend
    const backendFormData = new FormData()
    backendFormData.append('job_id', jobId)
    backendFormData.append('job_title', jobTitle)
    backendFormData.append('name', name)
    backendFormData.append('email', email)
    if (phone) backendFormData.append('phone', phone)
    if (linkedin) backendFormData.append('linkedin', linkedin)
    if (portfolio) backendFormData.append('portfolio', portfolio)
    if (coverLetter) backendFormData.append('cover_letter', coverLetter)
    if (resume && resume.size > 0) {
      backendFormData.append('resume', resume)
    }

    // Send to backend server
    const response = await fetch(`${BACKEND_URL}/api/job-applications`, {
      method: 'POST',
      body: backendFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      // Extract error message - handle both string and object formats
      let errorMessage = 'Failed to submit application'
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

    console.log('Job application submitted to backend:', {
      jobId,
      jobTitle,
      name,
      email,
      hasResume: !!(resume && resume.size > 0)
    })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data
    })
  } catch (error) {
    console.error('Job application error:', error)
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve applications (proxies to backend)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    const url = jobId
      ? `${BACKEND_URL}/api/job-applications?jobId=${jobId}`
      : `${BACKEND_URL}/api/job-applications`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with environment variables
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export async function POST(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = getSupabaseClient()

    const formData = await request.formData()

    // Extract form fields
    const jobTitle = formData.get('jobTitle') as string
    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const location = formData.get('location') as string
    const linkedIn = formData.get('linkedIn') as string
    const portfolio = formData.get('portfolio') as string
    const experience = formData.get('experience') as string
    const startDate = formData.get('startDate') as string
    const salary = formData.get('salary') as string
    const coverLetter = formData.get('coverLetter') as string
    const resumeFile = formData.get('resume') as File

    // Validate required fields
    if (!jobTitle || !fullName || !email || !resumeFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For now, we'll store the file name but skip the actual upload
    // TODO: Fix Supabase storage authentication and re-enable file upload
    const fileName = resumeFile.name
    const filePath = `pending_upload_${Date.now()}_${fullName.replace(/\s+/g, '_')}`

    // Insert application data into database
    const { data, error: dbError } = await supabase
      .from('job_applications')
      .insert({
        job_title: jobTitle,
        full_name: fullName,
        email: email,
        phone: phone || null,
        location: location || null,
        linkedin_url: linkedIn || null,
        portfolio_url: portfolio || null,
        resume_file_name: resumeFile.name,
        resume_file_path: filePath,
        resume_file_size: resumeFile.size,
        experience_level: experience || null,
        start_date: startDate || null,
        expected_salary: salary || null,
        cover_letter: coverLetter || null,
        application_status: 'pending'
      })
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        applicationId: data[0].id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
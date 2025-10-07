import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
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

    // Upload resume file to Supabase Storage
    const fileExt = resumeFile.name.split('.').pop()
    const fileName = `${Date.now()}_${fullName.replace(/\s+/g, '_')}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, resumeFile, {
        contentType: resumeFile.type,
        upsert: false
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload resume' },
        { status: 500 }
      )
    }

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

      // Clean up uploaded file if database insert fails
      await supabase.storage
        .from('resumes')
        .remove([filePath])

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
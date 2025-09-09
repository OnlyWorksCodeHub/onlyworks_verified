import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = createClient()

    // Create reports bucket
    const { data: reportsBucket, error: reportsError } = await supabase.storage
      .createBucket('reports', {
        public: false,
        allowedMimeTypes: ['application/json', 'application/pdf', 'text/html'],
        fileSizeLimit: 10485760 // 10MB
      })

    if (reportsError && reportsError.message !== 'Bucket already exists') {
      console.error('Reports bucket creation failed:', reportsError)
      return NextResponse.json({ 
        error: 'Failed to create reports bucket',
        details: reportsError.message 
      }, { status: 500 })
    }

    // Create screenshots bucket (in case it doesn't exist)
    const { data: screenshotsBucket, error: screenshotsError } = await supabase.storage
      .createBucket('screenshots', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

    if (screenshotsError && screenshotsError.message !== 'Bucket already exists') {
      console.error('Screenshots bucket creation failed:', screenshotsError)
    }

    return NextResponse.json({ 
      success: true,
      buckets: {
        reports: reportsBucket || 'already exists',
        screenshots: screenshotsBucket || 'already exists'
      }
    })

  } catch (error: any) {
    console.error('Bucket setup error:', error)
    return NextResponse.json({ 
      error: 'Failed to setup buckets',
      details: error.message 
    }, { status: 500 })
  }
}
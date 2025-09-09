import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { sessionId } = await request.json()

    console.log('=== Screenshot Test ===')
    console.log('User:', user.id)
    console.log('Session:', sessionId)

    // Create a minimal valid JPEG buffer
    const minimalJpegBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0xFF, 0xD9
    ])

    console.log('Created test image buffer, size:', minimalJpegBuffer.length)

    const fileName = `test-${Date.now()}.jpg`
    
    console.log('Testing storage upload...')
    
    // Test storage upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots')
      .upload(fileName, minimalJpegBuffer, {
        contentType: 'image/jpeg'
      })

    if (uploadError) {
      console.error('Storage upload failed:', uploadError)
      return NextResponse.json({ 
        error: 'Storage upload failed',
        details: uploadError.message 
      }, { status: 500 })
    }

    console.log('Storage upload successful:', uploadData.path)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName)

    console.log('Generated public URL:', publicUrl)

    // Test database insert - ONLY use existing columns
    console.log('Testing database insert...')
    
    const { data: dbData, error: dbError } = await supabase
      .from('screenshots')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        image_url: publicUrl,
        trigger_type: 'test',
        sequence_number: 999,
        mouse_x: null,
        mouse_y: null
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert failed:', dbError)
      return NextResponse.json({ 
        error: 'Database insert failed',
        details: dbError.message,
        code: dbError.code
      }, { status: 500 })
    }

    console.log('Database insert successful:', dbData.id)

    return NextResponse.json({
      success: true,
      message: 'Test screenshot saved successfully',
      screenshot: {
        id: dbData.id,
        url: publicUrl,
        fileName: fileName
      }
    })

  } catch (error: any) {
    console.error('Test failed:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error.message 
    }, { status: 500 })
  }
}

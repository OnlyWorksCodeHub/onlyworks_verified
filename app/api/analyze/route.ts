import { NextRequest, NextResponse } from 'next/server'
import { analyzeScreenshot } from '@/lib/ai/gemini'

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json()
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const analysis = await analyzeScreenshot(imageBase64)
    
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
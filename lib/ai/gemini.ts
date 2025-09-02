import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key')

export async function analyzeScreenshot(imageBase64: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('Gemini API key not set, returning mock data')
      return {
        productivity_score: Math.floor(Math.random() * 30) + 70,
        focus_score: Math.floor(Math.random() * 30) + 70,
        applications: ['Browser', 'VS Code'],
        activity_type: 'coding',
        is_productive: true,
        suggestions: ['Keep up the good work!']
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `Analyze this screenshot and provide:
    1. Productivity score (0-100)
    2. Focus score (0-100)
    3. Main application(s) being used
    4. Type of activity (coding, browsing, document work, communication, etc.)
    5. Is this productive work? (yes/no)
    6. Brief suggestions for improvement
    
    Return ONLY valid JSON, no markdown or explanation.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/png',
          data: imageBase64
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    
    // Clean the response and parse JSON
    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error('AI Analysis error:', error)
    // Return default values on error
    return {
      productivity_score: 75,
      focus_score: 75,
      applications: ['Unknown'],
      activity_type: 'general',
      is_productive: true,
      suggestions: ['Continue your work']
    }
  }
}

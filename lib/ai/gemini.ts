import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeScreenshot(base64Image: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `Analyze this screenshot and provide a structured productivity assessment.

IMPORTANT: Provide specific, actionable insights, not generic observations.

Analyze and report:

1. PRODUCTIVITY SCORE (0-100):
   - 90-100: Deep focused work (coding, design, writing, analysis)
   - 70-89: Productive but with some context switching
   - 50-69: Mixed productive and non-productive activities
   - 30-49: Mostly distracted or low-value activities
   - 0-29: Completely off-task or entertainment

2. FOCUS SCORE (0-100):
   - Based on number of applications/tabs visible
   - Presence of distracting elements
   - Clarity of work focus

3. ACTIVITY IDENTIFICATION:
   - What specific task appears to be in progress?
   - What applications are being used?
   - Is this deep work, shallow work, communication, or distraction?

4. KEY OBSERVATIONS:
   - What specific work is being done?
   - Any potential distractions visible?
   - Time management insights

5. SPECIFIC RECOMMENDATIONS:
   - Based on what you see, what would improve productivity?
   - Any workflow optimizations apparent?

Format your response as:
Productivity: [score]
Focus: [score]
Activity: [specific activity]
Applications: [list visible applications]
Task: [estimated task being performed]
Category: [deep work/shallow work/communication/distraction]
Observations: [2-3 specific observations]
Recommendations: [2-3 actionable suggestions]`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ])

    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini analysis error:', error)
    return null
  }
}

export async function generateProductivitySummary(analyses: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `Based on these work session analyses, generate a comprehensive productivity summary:

${JSON.stringify(analyses.slice(0, 10), null, 2)}

Create a detailed summary including:

1. OVERALL PATTERNS:
   - Main work focus areas
   - Productivity trends
   - Time management patterns

2. STRENGTHS (be specific):
   - What specific behaviors show good productivity?
   - What work patterns are effective?

3. IMPROVEMENT AREAS (be specific):
   - What specific distractions or inefficiencies were observed?
   - What patterns reduce productivity?

4. ACTIONABLE RECOMMENDATIONS:
   - 3-5 specific, implementable suggestions
   - Based on the actual data, not generic advice

5. KEY METRICS:
   - Most productive time periods
   - Most used applications
   - Focus vs distraction ratio

Keep the summary professional, specific, and actionable.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Summary generation error:', error)
    return null
  }
}

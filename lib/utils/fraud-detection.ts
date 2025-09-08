export const AUTOMATION_TOOLS = [
  'AutoHotkey',
  'AutoIt',
  'Macro Recorder',
  'Ghost Mouse',
  'Auto Clicker',
  'Selenium',
  'Puppeteer',
  'Playwright',
  'Cypress',
  'Robot Framework',
  'Sikuli',
  'PyAutoGUI',
  'Keyboard Maestro',
  'BetterTouchTool',
  'Automator',
  'UI.Vision',
  'WinAutomation',
  'Blue Prism',
  'UiPath',
  'Automation Anywhere'
]

export interface SuspiciousPattern {
  type: 'timing' | 'movement' | 'behavior' | 'tool'
  description: string
  severity: 'low' | 'medium' | 'high'
  confidence: number
}

export function detectSuspiciousPatterns(
  screenshots: any[],
  analyses: any[]
): SuspiciousPattern[] {
  const patterns: SuspiciousPattern[] = []

  // Check for perfect timing intervals
  if (screenshots.length > 5) {
    const intervals = []
    for (let i = 1; i < screenshots.length; i++) {
      const prev = new Date(screenshots[i - 1].created_at).getTime()
      const curr = new Date(screenshots[i].created_at).getTime()
      intervals.push(curr - prev)
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((sum, int) => sum + Math.pow(int - avgInterval, 2), 0) / intervals.length
    const stdDev = Math.sqrt(variance)
    
    // If standard deviation is very low, actions are too regular (bot-like)
    if (stdDev < 100 && avgInterval < 5000) {
      patterns.push({
        type: 'timing',
        description: 'Actions occur at unnaturally regular intervals',
        severity: 'high',
        confidence: 90
      })
    }
  }

  // Check for linear mouse movements
  const clickScreenshots = screenshots.filter(s => s.trigger_type === 'click' && s.mouse_x && s.mouse_y)
  if (clickScreenshots.length > 3) {
    const movements = []
    for (let i = 1; i < clickScreenshots.length; i++) {
      const dx = clickScreenshots[i].mouse_x - clickScreenshots[i - 1].mouse_x
      const dy = clickScreenshots[i].mouse_y - clickScreenshots[i - 1].mouse_y
      movements.push({ dx, dy })
    }
    
    // Check if movements are too linear
    const angles = movements.map(m => Math.atan2(m.dy, m.dx))
    const angleVariance = calculateVariance(angles)
    
    if (angleVariance < 0.1) {
      patterns.push({
        type: 'movement',
        description: 'Mouse movements are unnaturally linear',
        severity: 'medium',
        confidence: 75
      })
    }
  }

  // Check for automation tools
  const toolsDetected = new Set<string>()
  screenshots.forEach(s => {
    if (s.background_apps) {
      s.background_apps.forEach((app: string) => {
        if (AUTOMATION_TOOLS.some(tool => app.toLowerCase().includes(tool.toLowerCase()))) {
          toolsDetected.add(app)
        }
      })
    }
  })

  if (toolsDetected.size > 0) {
    patterns.push({
      type: 'tool',
      description: `Automation tools detected: ${Array.from(toolsDetected).join(', ')}`,
      severity: 'high',
      confidence: 100
    })
  }

  // Check for copy-paste without reading
  const copyPasteEvents = analyses.filter(a => a.copy_paste_detected)
  if (copyPasteEvents.length > 0) {
    const suspiciousCopyPaste = copyPasteEvents.filter(a => 
      a.time_on_content < 5 || // Less than 5 seconds reading
      !a.content_modified // Didn't modify after paste
    )
    
    if (suspiciousCopyPaste.length > 2) {
      patterns.push({
        type: 'behavior',
        description: 'Multiple copy-paste actions without reading or modification',
        severity: 'medium',
        confidence: 80
      })
    }
  }

  // Check for impossible productivity scores
  const highProductivityCount = analyses.filter(a => a.productivity_score > 95).length
  if (highProductivityCount / analyses.length > 0.9) {
    patterns.push({
      type: 'behavior',
      description: 'Suspiciously high productivity scores throughout session',
      severity: 'low',
      confidence: 60
    })
  }

  return patterns
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length
  return numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length
}

export function calculateAuthenticityScore(patterns: SuspiciousPattern[]): number {
  let score = 100

  patterns.forEach(pattern => {
    const penalty = pattern.severity === 'high' ? 30 : 
                   pattern.severity === 'medium' ? 15 : 5
    const adjustedPenalty = penalty * (pattern.confidence / 100)
    score -= adjustedPenalty
  })

  return Math.max(0, Math.round(score))
}

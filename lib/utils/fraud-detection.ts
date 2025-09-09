export function detectSuspiciousPatterns(screenshots: any[], analyses: any[]) {
  const patterns: string[] = []
  
  // Check for automation indicators
  if (screenshots.some(s => s.is_suspicious)) {
    patterns.push('Automation tools detected')
  }
  
  // Check for repetitive patterns
  const clickIntervals = screenshots.map((s, i) => {
    if (i === 0) return 0
    const prev = new Date(screenshots[i-1].created_at).getTime()
    const curr = new Date(s.created_at).getTime()
    return curr - prev
  }).filter(interval => interval > 0)
  
  // If clicks are too regular (same interval)
  const avgInterval = clickIntervals.reduce((a, b) => a + b, 0) / clickIntervals.length
  const variance = clickIntervals.reduce((sum, interval) => {
    return sum + Math.pow(interval - avgInterval, 2)
  }, 0) / clickIntervals.length
  
  if (variance < 100 && clickIntervals.length > 5) {
    patterns.push('Suspiciously regular click patterns')
  }
  
  // Check if all screenshots are identical
  const uniqueScreenshots = new Set(screenshots.map(s => s.file_path))
  if (uniqueScreenshots.size < screenshots.length * 0.5) {
    patterns.push('Many identical screenshots')
  }
  
  return patterns
}

export function calculateAuthenticityScore(patterns: string[]) {
  let score = 100
  
  // Deduct points for each suspicious pattern
  patterns.forEach(pattern => {
    if (pattern.includes('Automation')) score -= 30
    if (pattern.includes('regular click')) score -= 20
    if (pattern.includes('identical')) score -= 25
  })
  
  return Math.max(0, score)
}
// EOF
export interface PublicReport {
  id: string
  sessionId: string
  verificationCode: string
  companyName?: string
  projectName?: string
  workDuration: number // minutes
  
  // Verification metrics
  productivityScore: number
  authenticityVerified: boolean
  workSummary: string
  
  // Key metrics for public display
  keyMetrics: {
    totalActions: number
    focusedWorkPercentage: number
    toolsUsed: string[]
    tasksCompleted: string[]
    efficiencyRating: 'A' | 'B' | 'C' | 'D' | 'F'
  }
  
  // Verification proof
  verificationProof: {
    screenshotCount: number
    humanPatternScore: number
    noAutomationDetected: boolean
    consistencyScore: number
  }
  
  publicUrl: string
  expiresAt?: string
  createdAt: string
}

export interface SessionSummary {
  id: string
  sessionId: string
  
  // Narrative
  workNarrative: string
  accomplishments: string[]
  
  // Aggregate metrics
  metrics: {
    totalScreenshots: number
    totalClicks: number
    totalKeystrokes: number
    avgProductivityScore: number
    avgFocusScore: number
    avgAuthenticityScore: number
  }
  
  // Detailed feedback
  feedback: {
    strengths: string[]
    improvements: string[]
    specificWins: TimeBasedFeedback[]
    specificIssues: TimeBasedFeedback[]
    recommendations: string[]
  }
  
  // Verification
  verificationHash: string
  publicReportUrl?: string
  
  createdAt: string
}

export interface TimeBasedFeedback {
  time: string
  description: string
  suggestion?: string
  severity?: 'low' | 'medium' | 'high'
}

export interface VerificationData {
  sessionId: string
  hash: string
  timestamp: string
  screenshotHashes: string[]
  isValid: boolean
  tamperedIndices?: number[]
}

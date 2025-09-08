export interface WorkflowSession {
  id: string
  userId: string
  name: string
  projectName?: string
  clientName?: string
  status: 'active' | 'completed' | 'paused'
  professionType?: string
  createdAt: string
  endedAt?: string
  totalDuration?: number
  metadata?: Record<string, any>
}

export interface SessionMetrics {
  totalScreenshots: number
  totalClicks: number
  totalKeystrokes: number
  avgProductivityScore: number
  avgFocusScore: number
  avgAuthenticityScore: number
  avgEfficiencyScore: number
  suspiciousActivityCount: number
  aiInteractionCount: number
}

export interface SessionFeedback {
  strengths: string[]
  improvements: string[]
  specificWins: {
    time: string
    description: string
  }[]
  specificIssues: {
    time: string
    description: string
    suggestion: string
  }[]
  recommendations: string[]
}

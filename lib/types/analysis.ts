export interface Analysis {
  id: string
  screenshotId: string
  sessionId: string
  userId: string
  
  // Core scores (0-100)
  productivityScore: number
  focusScore: number
  efficiencyScore: number
  authenticityScore: number
  
  // Activity classification
  activityType: ActivityType
  primaryApplication: string
  applicationsUsed: string[]
  
  // AI usage tracking
  aiToolDetected?: AITool
  aiInteractionType?: AIInteractionType
  aiUsageQuality?: AIUsageQuality
  
  // Comprehension tracking
  copyPasteDetected: boolean
  contentModified: boolean
  timeOnContent: number // seconds
  comprehensionIndicators: {
    readingPattern: 'skimming' | 'thorough' | 'none'
    modificationRate: number // percentage
    testingBehavior: boolean
  }
  
  // Issues and warnings
  distractionsFound: string[]
  automationToolsDetected: string[]
  suspiciousPatterns: string[]
  
  rawAnalysis: any
  createdAt: string
}

export type ActivityType = 
  | 'coding'
  | 'designing'
  | 'writing'
  | 'analyzing'
  | 'researching'
  | 'meeting'
  | 'reviewing'
  | 'testing'
  | 'planning'
  | 'communicating'
  | 'idle'

export type AITool = 
  | 'ChatGPT'
  | 'Claude'
  | 'Copilot'
  | 'Gemini'
  | 'Perplexity'
  | 'Midjourney'
  | 'Other'

export type AIInteractionType = 
  | 'query'
  | 'copy'
  | 'modify'
  | 'verify'
  | 'ignore'
  | 'iterative'

export type AIUsageQuality = 
  | 'effective'
  | 'learning'
  | 'ineffective'
  | 'suspicious'

export interface WorkflowPattern {
  taskSwitchingFrequency: number
  deepWorkSessions: number
  averageFocusDuration: number
  breakPattern: 'healthy' | 'insufficient' | 'excessive'
  peakProductivityTime: string
  workStyle: 'focused' | 'multitasker' | 'balanced'
}

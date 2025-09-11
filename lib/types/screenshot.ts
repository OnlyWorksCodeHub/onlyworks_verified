export interface Screenshot {
  id: string
  sessionId: string
  userId: string
  imageUrl: string
  sequenceNumber: number
  previousScreenshotId?: string
  triggerType: 'click' | 'spacebar' | 'enter'
  mouseX?: number
  mouseY?: number
  activeWindow?: string
  activeUrl?: string
  backgroundApps?: string[]
  metadata?: {
    timestamp: string
    activeElement?: string
    clipboardActivity?: boolean
  }
  isSuspicious: boolean
  createdAt: string
}

export interface ScreenshotChain {
  screenshots: Screenshot[]
  isValid: boolean
  brokenLinks: number[]
  suspiciousGaps: {
    between: [number, number]
    duration: number
    reason: string
  }[]
}

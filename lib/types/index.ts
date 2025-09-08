export * from './session'
export * from './screenshot'
export * from './analysis'
export * from './report'

export type Profession = 
  | 'developer'
  | 'designer'
  | 'finance'
  | 'marketing'
  | 'sales'
  | 'legal'
  | 'product'
  | 'data-analyst'
  | 'writer'
  | 'other'

export type FeedbackStyle = 'encouraging' | 'direct' | 'analytical' | 'balanced'

export type TriggerType = 'click' | 'spacebar' | 'enter' | 'auto'

export interface User {
  id: string
  email: string
  fullName?: string
  profession?: Profession
  company?: string
  avatarUrl?: string
  preferences: {
    feedbackStyle: FeedbackStyle
    notificationFrequency: 'realtime' | 'session_end' | 'daily'
  }
}

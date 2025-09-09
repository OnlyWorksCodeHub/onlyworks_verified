import { z } from 'zod'

export const sessionIdSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID format')
})

export const createSessionSchema = z.object({
  name: z.string().min(1).max(255),
  projectName: z.string().max(255).optional(),
  clientName: z.string().max(255).optional()
})

export const captureScreenshotSchema = z.object({
  screenshot: z.string().regex(/^data:image\/\w+;base64,/, 'Invalid image format'),
  sessionId: z.string().uuid(),
  trigger: z.enum([
    'click', 
    'spacebar', 
    'enter', 
    'manual', 
    'test', 
    'session_start',
    'automatic',
    'window_blur',
    'window_focus'
  ]),
  metadata: z.object({
    sequenceNumber: z.number().int().positive().optional(),
    mouseX: z.number().optional(),
    mouseY: z.number().optional(),
    timestamp: z.string().datetime(),
    activeElement: z.string().optional(),
    activeText: z.string().max(100).optional(),
    videoWidth: z.number().optional(),
    videoHeight: z.number().optional(),
    canvasWidth: z.number().optional(),
    canvasHeight: z.number().optional(),
    isTestCapture: z.boolean().optional(),
    reason: z.string().optional(),
    interval: z.string().optional(),
    focusEvent: z.string().optional(),
    key: z.string().optional(),
    activeId: z.string().optional()
  }).optional()
})

export const analyzeScreenshotSchema = z.object({
  screenshotId: z.string().uuid(),
  imageUrl: z.string().url(),
  sessionId: z.string().uuid()
})

export const generateReportSchema = z.object({
  sessionId: z.string().uuid()
})

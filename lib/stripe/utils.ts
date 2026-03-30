import { Resend } from 'resend'
import crypto from 'crypto'

let resendClient: Resend | null = null

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

/**
 * Generate a unique, secure access code
 * Format: OW-XXXX-XXXX-XXXX (easy to read)
 */
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excludes confusing chars: 0, O, I, 1
  let code = 'OW-'

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      const randomIndex = crypto.randomInt(0, chars.length)
      code += chars[randomIndex]
    }
    if (i < 2) code += '-'
  }

  return code
}

/**
 * Send access code email to customer
 */
export async function sendAccessCodeEmail(
  email: string,
  accessCode: string,
  isTrial: boolean
): Promise<void> {
  const subject = isTrial
    ? 'Your OnlyWorks Trial Access Code'
    : 'Your OnlyWorks Access Code'

  const trialMessage = isTrial
    ? `<p style="margin: 0 0 16px 0;">Your 14-day free trial has started. You have full access to OnlyWorks Pro features.</p>
       <p style="margin: 0 0 16px 0;">After your trial ends, you'll be charged $19/month to continue your subscription.</p>`
    : `<p style="margin: 0 0 16px 0;">Thank you for subscribing to OnlyWorks Pro!</p>`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="background: #8b5cf6; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">OnlyWorks</h1>
      </div>

      <div style="padding: 32px;">
        <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #0a0a0a;">Welcome to OnlyWorks Pro!</h2>

        ${trialMessage}

        <p style="margin: 0 0 16px 0;">Use the access code below to download the OnlyWorks desktop app:</p>

        <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <div style="font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 28px; font-weight: 600; color: #8b5cf6; letter-spacing: 2px;">
            ${accessCode}
          </div>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.only-works.com'}/downloads?code=${accessCode}"
             style="display: inline-block; background: #8b5cf6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500;">
            Go to Downloads
          </a>
        </div>
      </div>

      <div style="padding: 24px 32px; border-top: 1px solid #e5e5e5; background: #fafafa;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          If you have any questions, reply to this email or contact us at support@only-works.com
        </p>
        <p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">
          &copy; ${new Date().getFullYear()} OnlyWorks. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`

  try {
    await getResend().emails.send({
      from: 'OnlyWorks <noreply@only-works.com>',
      to: email,
      subject,
      html,
    })
    console.log(`Access code email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

/**
 * Send trial ending notification email
 */
export async function sendTrialEndingEmail(
  email: string,
  daysRemaining: number
): Promise<void> {
  const subject = `Your OnlyWorks trial ends in ${daysRemaining} days`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="background: #8b5cf6; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">OnlyWorks</h1>
      </div>

      <div style="padding: 32px;">
        <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #0a0a0a;">Your trial is ending soon</h2>

        <p style="margin: 0 0 16px 0;">
          Your OnlyWorks Pro trial will end in <strong>${daysRemaining} days</strong>.
        </p>

        <p style="margin: 0 0 16px 0;">
          To continue using OnlyWorks Pro features without interruption, no action is needed -
          your subscription will automatically continue at $19/month.
        </p>

        <p style="margin: 0 0 16px 0;">
          If you'd like to cancel before your trial ends, you can manage your subscription at any time.
        </p>

        <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            <strong>What happens next:</strong><br>
            After your trial, you'll be charged $19/month. Your access code will continue to work - no need to re-enter it.
          </p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.only-works.com'}/account"
             style="display: inline-block; background: #8b5cf6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500;">
            View Account Details
          </a>
        </div>
      </div>

      <div style="padding: 24px 32px; border-top: 1px solid #e5e5e5; background: #fafafa;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          Questions? Reply to this email or contact us at support@only-works.com
        </p>
        <p style="margin: 16px 0 0 0; font-size: 14px; color: #666;">
          &copy; ${new Date().getFullYear()} OnlyWorks. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`

  try {
    await getResend().emails.send({
      from: 'OnlyWorks <noreply@only-works.com>',
      to: email,
      subject,
      html,
    })
    console.log(`Trial ending email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send trial ending email:', error)
    throw error
  }
}

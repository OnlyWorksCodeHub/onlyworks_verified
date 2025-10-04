// Email service for sending report share notifications
// Uses Resend for production, console logging for development

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'onlyworks@yourdomain.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

class EmailService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.resend = null
    this.shouldSendEmails = !!RESEND_API_KEY

    if (this.shouldSendEmails) {
      // Initialize Resend if API key is available
      this.initializeResend()
    }
  }

  async initializeResend() {
    try {
      const { Resend } = await import('resend')
      this.resend = new Resend(RESEND_API_KEY)
    } catch (error) {
      console.error('Failed to initialize Resend:', error)
    }
  }

  generateShareEmailHTML(reportData, shareLink, senderName, expiresAt) {
    const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OnlyWorks Report Shared With You</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
    .content { padding: 40px 30px; }
    .report-preview { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .stat-item { text-align: center; padding: 15px; background-color: white; border-radius: 6px; border: 1px solid #e2e8f0; }
    .stat-value { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 5px; }
    .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .cta-button { display: inline-block; background-color: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .cta-button:hover { background-color: #2563eb; }
    .expires-notice { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0; }
    .footer { background-color: #f8fafc; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
    .security-notice { font-size: 12px; color: #64748b; margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 OnlyWorks</h1>
      <p style="color: #e0e7ff; margin: 10px 0 0 0;">A work report has been shared with you</p>
    </div>

    <div class="content">
      <h2 style="color: #1e293b; margin-bottom: 10px;">Hello!</h2>
      <p style="color: #475569; line-height: 1.6;">
        <strong>${senderName}</strong> has shared a work report with you from OnlyWorks.
      </p>

      <div style="background-color: #eff6ff; border: 1px solid #3b82f6; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="color: #1e40af; margin: 0; font-weight: 600;">📋 What you can see:</p>
        <ul style="color: #1e40af; margin: 10px 0; padding-left: 20px;">
          <li>Basic productivity metrics & summary</li>
          <li>Preview of detailed sections</li>
        </ul>
        <p style="color: #1e40af; margin: 0; font-weight: 600;">🔓 Create a free account to unlock:</p>
        <ul style="color: #1e40af; margin: 10px 0; padding-left: 20px;">
          <li>Complete timeline & activity log</li>
          <li>All screenshots & visual timeline</li>
          <li>Technical details & code analysis</li>
          <li>Your own productivity tracking</li>
        </ul>
      </div>

      <div class="report-preview">
        <h3 style="margin-top: 0; color: #1e293b;">${reportData.title || 'Daily Work Report'}</h3>
        <p style="color: #64748b; margin-bottom: 15px;">
          📅 ${new Date(reportData.report_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${reportData.lines_written || 0}</div>
            <div class="stat-label">Lines Written</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${reportData.files_modified_count || 0}</div>
            <div class="stat-label">Files Modified</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${reportData.session_duration || 'N/A'}</div>
            <div class="stat-label">Session Duration</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${reportData.screenshot_count || 0}</div>
            <div class="stat-label">Screenshots</div>
          </div>
        </div>

        ${reportData.executive_summary ? `
        <div style="margin-top: 20px;">
          <h4 style="color: #1e293b; margin-bottom: 10px;">Executive Summary</h4>
          <p style="color: #475569; line-height: 1.6; font-style: italic;">
            "${reportData.executive_summary.substring(0, 200)}${reportData.executive_summary.length > 200 ? '...' : ''}"
          </p>
        </div>
        ` : ''}
      </div>

      <div style="text-align: center;">
        <a href="${shareLink}" class="cta-button">
          📖 View Full Report
        </a>
      </div>

      <div class="expires-notice">
        <strong>⏰ Access Expires:</strong> This link will expire on ${expirationDate}
      </div>

      <div class="security-notice">
        <strong>🔒 Security Notice:</strong> This link is unique to you and should not be shared with others.
        If you didn't expect this email, you can safely ignore it.
      </div>

      <p style="color: #64748b; margin-top: 30px;">
        Want to track your own productivity?
        <a href="${APP_URL}" style="color: #3b82f6;">Get OnlyWorks</a>
      </p>
    </div>

    <div class="footer">
      <p>This email was sent by OnlyWorks</p>
      <p>
        <a href="${APP_URL}/privacy" style="color: #64748b;">Privacy Policy</a> |
        <a href="${APP_URL}/terms" style="color: #64748b;">Terms of Service</a>
      </p>
    </div>
  </div>
</body>
</html>
    `
  }

  generateShareEmailText(reportData, shareLink, senderName, expiresAt) {
    const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return `
OnlyWorks - Work Report Shared With You

Hello!

${senderName} has shared a work report with you from OnlyWorks.

Report: ${reportData.title || 'Daily Work Report'}
Date: ${new Date(reportData.report_date).toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}

Quick Stats:
- Lines Written: ${reportData.lines_written || 0}
- Files Modified: ${reportData.files_modified_count || 0}
- Session Duration: ${reportData.session_duration || 'N/A'}
- Screenshots: ${reportData.screenshot_count || 0}

${reportData.executive_summary ? `
Executive Summary:
"${reportData.executive_summary.substring(0, 300)}${reportData.executive_summary.length > 300 ? '...' : ''}"
` : ''}

View Full Report: ${shareLink}

⏰ This link expires on ${expirationDate}

🔒 Security Notice: This link is unique to you and should not be shared with others.

--
OnlyWorks - Productivity Tracking Made Simple
${APP_URL}
    `.trim()
  }

  async sendShareEmail(recipientEmail, reportData, shareToken, senderName, expiresAt) {
    const shareLink = `${APP_URL}/shared/${shareToken}`

    const emailData = {
      to: recipientEmail,
      from: FROM_EMAIL,
      subject: `📊 ${senderName} shared a work report with you - OnlyWorks`,
      html: this.generateShareEmailHTML(reportData, shareLink, senderName, expiresAt),
      text: this.generateShareEmailText(reportData, shareLink, senderName, expiresAt)
    }

    if (this.shouldSendEmails && this.resend) {
      try {
        const result = await this.resend.emails.send(emailData)
        console.log('Email sent successfully:', result)
        return { success: true, messageId: result.id }
      } catch (error) {
        console.error('Failed to send email via Resend:', error)
        return { success: false, error: error.message }
      }
    } else {
      // Development mode - log email to console
      console.log('\n=== EMAIL WOULD BE SENT ===')
      console.log('To:', recipientEmail)
      console.log('Subject:', emailData.subject)
      console.log('Share Link:', shareLink)
      console.log('Expires:', expiresAt)
      console.log('\nText Content:')
      console.log(emailData.text)
      console.log('\n=== END EMAIL ===\n')

      return { success: true, messageId: 'dev-mode-' + Date.now() }
    }
  }

  async sendTestEmail(recipientEmail) {
    // Test email functionality
    const testData = {
      to: recipientEmail,
      from: FROM_EMAIL,
      subject: '✅ OnlyWorks Email Service Test',
      html: '<h1>Email service is working!</h1><p>This is a test email from OnlyWorks.</p>',
      text: 'Email service is working! This is a test email from OnlyWorks.'
    }

    if (this.shouldSendEmails && this.resend) {
      try {
        const result = await this.resend.emails.send(testData)
        return { success: true, messageId: result.id }
      } catch (error) {
        return { success: false, error: error.message }
      }
    } else {
      console.log('Test email would be sent to:', recipientEmail)
      return { success: true, messageId: 'test-dev-mode' }
    }
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export class for testing
export { EmailService }
'use client'

import { LegalPage } from '@/components/LegalPage'

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: `This Privacy Policy describes how OnlyWorks ("we", "us", or "our") collects, uses, and shares information about you when you use our productivity verification platform, website, and related services (collectively, the "Services").

By using our Services, you agree to the collection and use of information as described in this policy.`
  },
  {
    id: 'information-collected',
    title: 'Information We Collect',
    content: `An OnlyWorks account is required to use the Services. We collect information you provide directly to us, and information the desktop app captures during the work sessions you choose to start and stop.

**Account Information**: Name, email address, and profile details. You sign in with Google, LinkedIn, or email (with email verification).

**Work Session Data** (captured only while a session you started is running, never always-on): full-screen screenshots (taken on a 15-second timer and on certain actions such as click, Enter, or copy); text extracted from those screenshots via on-device Optical Character Recognition (OCR); the active application and window titles; counts of clicks and keystrokes (we record the counts only, never the content of what you type); and a list of processes running during the session. The desktop app stops capturing the moment you end a session.

**Payment Information**: For paid hiring-side plans, billing details are processed securely through Stripe. We do not store full credit card numbers.

**Communications**: Messages you send to us, including support requests and feedback.

• **Device Information**: Operating system, screen and display configuration, basic hardware specifications, application version, and network connectivity status, used for security and to operate the Services.`
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: `We use the information we collect to:

• Generate your AI-written work report and the verified-skill profile that lives on your OnlyWorks Profile
• Provide, maintain, and operate our Services
• Process payments for paid hiring-side plans and send related information
• Send technical notices, updates, and security alerts
• Respond to your comments, questions, and support requests
• Review trends, usage patterns, and service performance to improve the Services

**AI processing and how reports are generated.** When you end a session, your screenshots and the OCR text extracted from them are uploaded to the OnlyWorks backend (hosted on Render) and analyzed by Google Gemini to produce your report. Report generation happens server-side, not on your device, and typically completes in tens of seconds. Your captured screenshots may also be stored and used to train and improve the AI that powers OnlyWorks. We do not sell this data.`
  },
  {
    id: 'data-sharing',
    title: 'How We Share Your Information',
    content: `We do not sell your personal information. We may share information in the following circumstances:

• **Sub-processors**: We use the third-party service providers listed below to operate the Services, under confidentiality and data-protection obligations.

• **People you share with**: Your report lives on your OnlyWorks Profile as a shareable link and can be sent by email. You choose what appears on your profile and who receives the link. Share links default to expiring after about 30 days.

• **Legal Requirements**: When required by law or to protect our rights, privacy, safety, or property.

• **Business Transfers**: In connection with any merger, acquisition, or sale of company assets.

**Our sub-processors:**

• **Google Gemini** — AI analysis of your screenshots and OCR text to generate reports. Data shared: screenshots, extracted text, and related metadata.

• **Supabase** — database storage and synchronization of your account and session data.

• **Render** — hosting and processing for the OnlyWorks backend that receives session data and runs report generation.

• **Resend** — transactional email (such as verification and report links). Data shared: email address and message content.`
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your information:

• Data is encrypted in transit using HTTPS/TLS
• Data is encrypted at rest on our providers' infrastructure
• Access controls and authentication requirements
• Reputable cloud infrastructure (see our sub-processors above)

OnlyWorks is not end-to-end encrypted. To generate your report, your screenshots and OCR text are uploaded to our backend and processed by Google Gemini, so OnlyWorks and its sub-processors can access this content as needed to operate the Services. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.`
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: `We retain your information as follows:

• **Account data**: retained while your account is active, and for an additional 30 days after account deletion for operational purposes.

• **Session data** (screenshots, OCR text, and related metadata): retained for the life of your account plus 90 days.

• **Aggregated analytics**: de-identified, aggregated data may be retained indefinitely.

You can delete your account at any time through the application or by contacting us. After a deletion request, complete deletion may take up to 90 days due to backup systems and legal requirements. The app also lets you purge the screenshots stored for AI training. We do not currently delete session data on an automatic time-based schedule.`
  },
  {
    id: 'your-rights',
    title: 'Your Rights & Choices',
    content: `Depending on your location, you may have the following rights:

• **Access**: Request a copy of the personal information we hold about you
• **Correction**: Request correction of inaccurate personal information
• **Deletion**: Request deletion of your personal information
• **Portability**: Request an export of your data in a portable format
• **Opt-out**: Unsubscribe from marketing communications at any time

To exercise these rights, contact us at privacy@only-works.com or use the controls in your account settings.`
  },
  {
    id: 'cookies',
    title: 'Cookies & Analytics',
    content: `We use cookies and similar technologies to:

• Keep you logged in and remember your preferences
• Understand how you use our Services
• Improve performance and security
• Provide analytics and insights

You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of our Services.`
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: `If you have questions about this Privacy Policy or our privacy practices, please contact us:

**Email**: privacy@only-works.com

We will respond to your inquiry within 30 days.`
  }
]

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" lastUpdated="June 13, 2026" sections={sections} activeLink="privacy" />
}

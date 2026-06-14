'use client'

import { LegalPage } from '@/components/LegalPage'

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: `By accessing or using OnlyWorks ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.

We may update these Terms from time to time, and your continued use of the Service constitutes acceptance of any changes.`
  },
  {
    id: 'description',
    title: 'Description of Service',
    content: `OnlyWorks is a free desktop application for macOS and Windows, with an accompanying web profile, that turns your real work into a shareable report. The Service includes:

• **Work Sessions**: A session that you manually start and stop. While a session is running, the app captures full-screen screenshots (on a timer and on actions such as clicks, Enter, and copy), the on-screen text read from those screenshots (OCR), the active application and window titles, counts of clicks and keystrokes (never the content of what you type), and the list of running processes.
• **AI Reports**: Screenshots and OCR text are uploaded to the OnlyWorks backend and processed by a third-party AI service (Google Gemini) to generate a written report — an executive summary, key accomplishments, skills used, strengths, growth areas, next steps, and a productivity score.
• **Verified Skills**: The AI corroborates each claimed skill against your own captured work across sessions and labels it "Verified" with a count. "Verified" reflects this AI cross-checking only. It is not a cryptographic proof, a digital signature, identity verification, or human review.
• **Your Profile**: Reports live on your OnlyWorks profile, which you can share through a single link or by email. There is no local file export.

The Service is intended for individuals who want to document and share evidence of their own work. You start and stop every session; the app does not run on its own.`
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Account',
    content: `To use the Service, you must:

• Be at least 18 years of age
• Have the legal capacity to enter into a binding agreement
• Not be prohibited from using the Service under applicable laws

**Account Required**: An account is required to use OnlyWorks. You sign in with Google, LinkedIn, or an email address (email sign-up requires verification). You may not use the Service without signing in.

**Account Responsibilities**:
• You are responsible for maintaining the confidentiality of your account credentials
• You are responsible for all activities that occur under your account
• You must notify us immediately of any unauthorized use of your account
• You may not share your account with others or create multiple accounts`
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: `You agree NOT to:

• Use the Service for any illegal purpose or in violation of any laws
• Use the Service to capture another person's screen or activity, or to capture content you do not have the right to record
• Run sessions on devices or accounts you are not authorized to use
• Use automation, bots, or artificial means to fake the work captured during a session
• Upload malware, viruses, or other harmful code
• Misrepresent the report or your "Verified" skills as something other than an AI-generated summary of your captured sessions
• Access or attempt to access other users' accounts or data
• Reverse engineer, decompile, or disassemble the Service
• Use the Service to infringe on intellectual property rights
• Engage in any activity that interferes with the Service's operation

Violation of these terms may result in immediate termination of your account.`
  },
  {
    id: 'payment',
    title: 'Payment Terms',
    content: `**Free for Job Seekers**: Running sessions, generating reports, your profile, and sharing your report are free. You do not need a paid plan to create or share a report.

**Paid Plans**: Paid plans apply to hiring features (such as posting jobs, candidate matching, and candidate search) and to an optional verified-badge upsell on a profile. Paid plans start with a 14-day trial.

**Billing**: Paid plans are processed through Stripe. By starting a paid plan, you authorize us to charge your payment method on a recurring basis after any applicable trial.

**Auto-Renewal**: Paid plans automatically renew unless cancelled before the renewal date. You can cancel at any time through your account settings.

**Refunds**: Refund eligibility and any applicable refund window are described at the point of purchase. Where a refund is issued, it is processed to the original payment method.

**Price Changes**: We may change paid-plan prices with 30 days' notice. Existing plans will be honored until renewal.`
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: `**Our IP**: The Service, including all software, designs, text, graphics, and other content, is owned by OnlyWorks Inc. and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.

**Your Content**: You retain ownership of the work session data and screenshots captured through the Service. By using the Service, you grant us a license to upload, process, and store this data as necessary to provide the Service — including processing screenshots and OCR text with our AI sub-processor to generate reports. We also store screenshots to train and improve our AI. See the Privacy Policy for details on how to purge training screenshots.

**Feedback**: Any feedback, suggestions, or ideas you provide may be used by us without obligation or compensation to you.`
  },
  {
    id: 'privacy',
    title: 'Privacy & Data',
    content: `Your use of the Service is subject to our Privacy Policy, which describes how we collect, use, and share your information.

**Data Processing**: By using the Service, you consent to the capture of your work session data — full-screen screenshots, OCR'd on-screen text, active app and window titles, click and keystroke counts, and running processes — and to its upload to and processing on the OnlyWorks backend. OCR runs on your device; reports are generated server-side. Screenshots are also stored to train and improve our AI.

**Sub-processors**: We use third-party services to operate the Service, including Google Gemini (AI processing), Supabase (database and storage), Render (backend hosting), and Resend (email). Each has its own terms and privacy practices.

**Data Sharing**: Your report is private until you choose to share it. You control what appears on your profile and who receives your share link. Share links default to expiring after about 30 days.

**Data Security**: Data is encrypted in transit (HTTPS/TLS) and at rest on our providers' infrastructure. This is not end-to-end or client-side encryption: screenshots and OCR text are decrypted server-side so they can be processed into reports. No system is completely secure.

**Your Controls**: You start and stop every session, choose what is on your profile and who can see your share link, and can request a purge of screenshots stored for AI training.`
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

We do not warrant that:
• The Service will be uninterrupted or error-free
• The Service will meet your specific requirements
• The results obtained from the Service will be accurate or reliable
• Any errors in the Service will be corrected

You use the Service at your own risk. We are not responsible for any decisions made based on data or reports generated by the Service.`
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

• We shall not be liable for any indirect, incidental, special, consequential, or punitive damages
• Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim
• We are not liable for any loss of data, profits, or business opportunities

These limitations apply regardless of the theory of liability and even if we have been advised of the possibility of such damages.`
  },
  {
    id: 'termination',
    title: 'Termination',
    content: `**By You**: You may terminate your account at any time through your account settings or by contacting us.

**By Us**: We may suspend or terminate your account if you:
• Violate these Terms
• Engage in fraudulent or illegal activity
• Fail to pay applicable fees
• Pose a security risk to the Service

Upon termination, your right to use the Service ceases immediately.

**Retention on Deletion**: When you delete your account, your data is deleted within 30 days, except that session data may be kept for up to an additional 90 days and aggregated, non-identifying analytics may be retained indefinitely. Completing full deletion may take up to 90 days. We may also retain certain data where required by law. See the Privacy Policy for details.`
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: `These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles.

**Dispute Resolution**: Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.

**Class Action Waiver**: You agree to resolve disputes individually and waive the right to participate in class actions.

**Venue**: Any legal proceedings shall take place in the courts of Delaware.`
  },
  {
    id: 'contact',
    title: 'Contact Information',
    content: `For questions about these Terms, please contact us:

**Email**: legal@only-works.com

**Response Time**: We aim to respond to all inquiries within 5 business days.`
  }
]

export default function TermsPage() {
  return <LegalPage title="Terms of Service" lastUpdated="June 2026" sections={sections} activeLink="terms" />
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: `This Privacy Policy describes how OnlyWorks ("we", "us", or "our") collects, uses, and shares information about you when you use our productivity verification platform, website, and related services (collectively, the "Services").

We are committed to protecting your privacy and ensuring you understand how your information is handled. Please read this policy carefully to understand our practices regarding your personal data.`
  },
  {
    id: 'information-collected',
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, including:

• **Account Information**: Name, email address, password, and profile details when you create an account.

• **Work Session Data**: Screenshots, activity timestamps, application usage, and productivity metrics captured during active tracking sessions.

• **Payment Information**: Billing details processed securely through Stripe. We do not store full credit card numbers.

• **Communications**: Messages you send to us, including support requests and feedback.

• **Device Information**: Browser type, operating system, device identifiers, and IP address for security and analytics purposes.`
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    content: `We use the information we collect to:

• Provide, maintain, and improve our Services
• Generate productivity reports and verification documents
• Detect and prevent fraudulent activity and automation
• Process payments and send related information
• Send technical notices, updates, and security alerts
• Respond to your comments, questions, and support requests
• Monitor and analyze trends, usage, and activities
• Personalize and improve your experience`
  },
  {
    id: 'data-sharing',
    title: 'How We Share Your Information',
    content: `We do not sell your personal information. We may share information in the following circumstances:

• **With Your Consent**: When you explicitly authorize sharing with third parties.

• **Service Providers**: With vendors who perform services on our behalf, subject to confidentiality obligations.

• **Employers/Clients**: Work session data may be shared with authorized parties as part of the verification service, based on your settings.

• **Legal Requirements**: When required by law or to protect our rights, privacy, safety, or property.

• **Business Transfers**: In connection with any merger, acquisition, or sale of company assets.`
  },
  {
    id: 'data-security',
    title: 'Data Security',
    content: `We implement industry-standard security measures to protect your information:

• All data is encrypted in transit using TLS 1.3
• Data at rest is encrypted using AES-256 encryption
• Regular security audits and penetration testing
• Access controls and authentication requirements
• Secure cloud infrastructure with SOC 2 compliance

While we strive to protect your personal information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: `We retain your information based on your subscription plan:

• **Free Plan**: Work session data retained for 7 days
• **Pro Plan**: Work session data retained for 90 days
• **Enterprise Plan**: Custom retention policies available

Account information is retained until you delete your account. You can request deletion of your data at any time through your account settings or by contacting us.`
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
    title: 'Cookies & Tracking',
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

**Address**: OnlyWorks Inc.
123 Privacy Lane
San Francisco, CA 94105

We will respond to your inquiry within 30 days.`
  }
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('overview')

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      {/* Simple header */}
      <header className="border-b" style={{ borderColor: '#e5e5e5', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium" style={{ color: '#0a0a0a' }}>
            ← Back to OnlyWorks
          </Link>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm font-medium" style={{ color: '#0064e0' }}>Privacy Policy</Link>
            <Link href="/terms" className="text-sm" style={{ color: '#525252' }}>Terms of Service</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r sticky top-0 h-screen overflow-y-auto hidden lg:block" style={{ borderColor: '#e5e5e5' }}>
          <nav className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#525252' }}>
              Privacy Policy
            </h2>
            <ul className="space-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      color: activeSection === section.id ? '#0064e0' : '#525252',
                      background: activeSection === section.id ? '#f0f7ff' : 'transparent',
                      fontWeight: activeSection === section.id ? 500 : 400
                    }}
                  >
                    {index + 1}. {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="mb-12">
              <h1 className="text-4xl font-semibold mb-4" style={{ color: '#0a0a0a', letterSpacing: '-0.02em' }}>
                Privacy Policy
              </h1>
              <p className="text-sm" style={{ color: '#525252' }}>
                Effective Date: January 1, 2025 · Last Updated: January 2025
              </p>
            </div>

            <div className="space-y-16">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-8">
                  <h2 className="text-xl font-semibold mb-4" style={{ color: '#0a0a0a' }}>
                    {index + 1}. {section.title}
                  </h2>
                  <div
                    className="prose prose-sm"
                    style={{
                      color: '#374151',
                      lineHeight: 1.75,
                      fontSize: '0.9375rem'
                    }}
                  >
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4 whitespace-pre-line">
                        {paragraph.split('**').map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t" style={{ borderColor: '#e5e5e5' }}>
              <p className="text-sm" style={{ color: '#525252' }}>
                © 2025 OnlyWorks Inc. All rights reserved.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

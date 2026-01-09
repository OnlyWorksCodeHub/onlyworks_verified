'use client'

import Link from 'next/link'
import { useState } from 'react'

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: `By accessing or using OnlyWorks ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.

These Terms constitute a legally binding agreement between you and OnlyWorks Inc. ("Company," "we," "us," or "our"). We may update these Terms from time to time, and your continued use of the Service constitutes acceptance of any changes.`
  },
  {
    id: 'description',
    title: 'Description of Service',
    content: `OnlyWorks provides a productivity verification platform that includes:

• **Screenshot Capture**: Periodic screenshots during active work sessions
• **Activity Tracking**: Monitoring of application usage and work patterns
• **AI Analysis**: Automated detection of productivity patterns and potential fraud
• **Report Generation**: Verifiable productivity reports for employers or clients
• **Data Storage**: Secure storage of work session data

The Service is designed for professionals who need to verify their work to employers, clients, or other authorized parties.`
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Account',
    content: `To use the Service, you must:

• Be at least 18 years of age
• Have the legal capacity to enter into a binding agreement
• Not be prohibited from using the Service under applicable laws

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
• Attempt to circumvent, disable, or interfere with the tracking functionality
• Use automation, bots, or artificial means to simulate productivity
• Upload malware, viruses, or other harmful code
• Falsify or misrepresent your work activity
• Access or attempt to access other users' accounts or data
• Reverse engineer, decompile, or disassemble the Service
• Use the Service to infringe on intellectual property rights
• Engage in any activity that interferes with the Service's operation

Violation of these terms may result in immediate termination of your account.`
  },
  {
    id: 'payment',
    title: 'Payment Terms',
    content: `**Subscription Plans**: The Service offers various subscription plans with different features and pricing.

**Billing**: All payments are processed securely through Stripe. By subscribing, you authorize us to charge your payment method on a recurring basis.

**Auto-Renewal**: Subscriptions automatically renew unless cancelled before the renewal date. You can cancel at any time through your account settings.

**Refunds**: We offer a 14-day refund window for new subscriptions. After this period, fees are non-refundable. Refunds are processed to the original payment method.

**Price Changes**: We may change subscription prices with 30 days' notice. Existing subscriptions will be honored until renewal.`
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    content: `**Our IP**: The Service, including all software, designs, text, graphics, and other content, is owned by OnlyWorks Inc. and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.

**Your Content**: You retain ownership of the work session data and screenshots captured through the Service. By using the Service, you grant us a limited license to process and store this data as necessary to provide the Service.

**Feedback**: Any feedback, suggestions, or ideas you provide may be used by us without obligation or compensation to you.`
  },
  {
    id: 'privacy',
    title: 'Privacy & Data',
    content: `Your use of the Service is subject to our Privacy Policy, which describes how we collect, use, and share your information.

**Data Processing**: By using the Service, you consent to the processing of your work session data, including screenshots and activity information.

**Data Sharing**: Work session data may be shared with authorized parties (employers, clients) based on your settings and consent.

**Data Security**: We implement industry-standard security measures to protect your data. However, no system is completely secure.`
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

Upon termination, your right to use the Service ceases immediately. We may retain certain data as required by law or for legitimate business purposes.`
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

**Address**: OnlyWorks Inc.
123 Legal Avenue
Wilmington, DE 19801

**Response Time**: We aim to respond to all inquiries within 5 business days.`
  }
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptance')

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
            <Link href="/privacy" className="text-sm" style={{ color: '#525252' }}>Privacy Policy</Link>
            <Link href="/terms" className="text-sm font-medium" style={{ color: '#0064e0' }}>Terms of Service</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r sticky top-0 h-screen overflow-y-auto hidden lg:block" style={{ borderColor: '#e5e5e5' }}>
          <nav className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#525252' }}>
              Terms of Service
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
                Terms of Service
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

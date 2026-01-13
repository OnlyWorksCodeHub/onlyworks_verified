'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Mail, Download, Shield, Monitor, Zap, BarChart3, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { Navigation } from '@/components/Navigation'

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

function FAQSection({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-5 py-4 flex items-center justify-between text-left"
          >
            <span className="font-medium">{item.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>
          {openIndex === index && (
            <div className="px-5 pb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function SupportPage() {
  const faqItems: FAQItem[] = [
    {
      question: 'How do I completely uninstall the app?',
      answer: (
        <div>
          <p className="mb-3">
            To do a fresh reinstall, you need to remove the app and all its data. We provide an uninstaller script that does this automatically.
          </p>
          <a
            href="/uninstall-onlyworks.command"
            download
            className="inline-flex items-center gap-2 text-[#8b5cf6] hover:underline"
          >
            <Download className="w-4 h-4" />
            Download Uninstaller (Mac)
          </a>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Right-click the file and select "Open" to run it (required for unsigned scripts on macOS).
          </p>
        </div>
      ),
    },
    {
      question: 'The app is not starting. What should I do?',
      answer: (
        <div>
          <p className="mb-2">Try these steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Make sure the app is in your Applications folder</li>
            <li>Try right-clicking the app and selecting "Open" (bypasses Gatekeeper on first launch)</li>
            <li>Check System Settings → Privacy & Security for any blocked app warnings</li>
            <li>If all else fails, download the uninstaller, run it, then reinstall the app</li>
          </ol>
        </div>
      ),
    },
    {
      question: 'Permissions are not working. How do I fix this?',
      answer: (
        <div>
          <p className="mb-2">If permissions aren't working:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open System Settings → Privacy & Security → Screen Recording</li>
            <li>Find "OnlyWorks Desktop" and toggle it OFF then ON again</li>
            <li>Do the same for Accessibility permissions</li>
            <li>Restart the app after changing permissions</li>
          </ol>
          <div className="mt-3 p-3 rounded-lg flex gap-2" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
            <p className="text-xs">
              <strong>Important:</strong> Make sure you add the app to "Screen & System Audio Recording" (NOT "System Audio Recording Only").
            </p>
          </div>
        </div>
      ),
    },
    {
      question: 'How does the app update?',
      answer: 'OnlyWorks Desktop checks for updates automatically when you open the app. If an update is available, it will download in the background and prompt you to restart when ready. You can also manually check by reopening the app.',
    },
    {
      question: 'Is my data private and secure?',
      answer: (
        <div>
          <p className="mb-2">Yes, we take privacy seriously:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Screenshots are processed locally on your device when possible</li>
            <li>Data is encrypted in transit and at rest</li>
            <li>We never sell your data to third parties</li>
            <li>You can delete your account and data at any time</li>
          </ul>
          <p className="mt-2">
            Read our full <Link href="/privacy" className="text-[#8b5cf6] hover:underline">Privacy Policy</Link> for more details.
          </p>
        </div>
      ),
    },
    {
      question: 'What macOS version do I need?',
      answer: 'OnlyWorks Desktop requires macOS 10.15 (Catalina) or later. It runs natively on both Apple Silicon (M1/M2/M3) and Intel Macs.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: (
        <div>
          <p>
            You can manage your subscription from your account settings in the app, or contact us at{' '}
            <a href="mailto:support@only-works.com" className="text-[#8b5cf6] hover:underline">
              support@only-works.com
            </a>
            {' '}and we'll help you right away.
          </p>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="mb-4">Help Center</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to get started and make the most of OnlyWorks.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="pb-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <a href="#installation" className="card text-center py-6 hover:border-[#8b5cf6] transition-colors">
              <Download className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
              <span className="text-sm font-medium">Installation</span>
            </a>
            <a href="#permissions" className="card text-center py-6 hover:border-[#8b5cf6] transition-colors">
              <Shield className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
              <span className="text-sm font-medium">Permissions</span>
            </a>
            <a href="#features" className="card text-center py-6 hover:border-[#8b5cf6] transition-colors">
              <Zap className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
              <span className="text-sm font-medium">Features</span>
            </a>
            <a href="#faq" className="card text-center py-6 hover:border-[#8b5cf6] transition-colors">
              <BarChart3 className="w-6 h-6 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
              <span className="text-sm font-medium">FAQ</span>
            </a>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section id="installation" className="py-12" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-8">Installation Guide</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>1</div>
                <div>
                  <h3 className="font-medium mb-1">Download the app</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Go to the <Link href="/downloads" className="text-[#8b5cf6] hover:underline">Downloads page</Link> and click "Download for Mac". Choose Apple Silicon if you have an M1/M2/M3 Mac, or Intel for older Macs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>2</div>
                <div>
                  <h3 className="font-medium mb-1">Install the app</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Open the downloaded DMG file. Drag the OnlyWorks icon to the Applications folder. You can then eject the DMG.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>3</div>
                <div>
                  <h3 className="font-medium mb-1">Launch OnlyWorks</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Open OnlyWorks from your Applications folder. On first launch, you may need to right-click and select "Open" to bypass macOS security.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>4</div>
                <div>
                  <h3 className="font-medium mb-1">Grant permissions</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Follow the on-screen prompts to grant Screen Recording and Accessibility permissions. See the Permissions section below for details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#8b5cf6', color: 'white' }}>5</div>
                <div>
                  <h3 className="font-medium mb-1">Sign in</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Sign in with Google, GitHub, or create an account with your email. Complete your profile setup and you're ready to go!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Permissions Setup */}
      <section id="permissions" className="py-12">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-8">Permissions Setup (macOS)</h2>

            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              OnlyWorks needs two permissions to work properly. The app will prompt you to grant these on first launch.
            </p>

            <div className="space-y-6">
              {/* Screen Recording */}
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl" style={{ background: 'var(--bg-alt)' }}>
                    <Monitor className="w-6 h-6" style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Screen Recording</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Required to capture screenshots for productivity analysis.
                    </p>
                    <div className="p-3 rounded-lg mb-3 flex gap-2" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
                      <p className="text-xs">
                        <strong>Important:</strong> Add the app to <strong>"Screen & System Audio Recording"</strong> (NOT "System Audio Recording Only"). This is a common mistake!
                      </p>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <strong>How to enable:</strong> System Settings → Privacy & Security → Screen Recording → Toggle ON for OnlyWorks Desktop
                    </p>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl" style={{ background: 'var(--bg-alt)' }}>
                    <Shield className="w-6 h-6" style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Accessibility</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      Required for keyboard shortcuts and system-wide features.
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <strong>How to enable:</strong> System Settings → Privacy & Security → Accessibility → Toggle ON for OnlyWorks Desktop
                    </p>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
                <h4 className="font-medium mb-2">Permissions not working?</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Try toggling the permission OFF then ON again, then restart the app. If issues persist, download the <a href="/uninstall-onlyworks.command" download className="text-[#8b5cf6] hover:underline">uninstaller</a>, right-click it and select "Open" to run, then reinstall the app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-12" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-8">Features Overview</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <Zap className="w-8 h-8 mb-4" style={{ color: '#8b5cf6' }} />
                <h3 className="font-medium mb-2">AI-Powered Analysis</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Automatically analyzes your screen activity to understand what you're working on and identify productivity patterns.
                </p>
              </div>

              <div className="card p-6">
                <BarChart3 className="w-8 h-8 mb-4" style={{ color: '#8b5cf6' }} />
                <h3 className="font-medium mb-2">Productivity Tracking</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Track your work sessions, see how you spend your time, and get insights to improve focus and efficiency.
                </p>
              </div>

              <div className="card p-6">
                <Monitor className="w-8 h-8 mb-4" style={{ color: '#8b5cf6' }} />
                <h3 className="font-medium mb-2">Work Session Monitoring</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Automatically detects when you start and end work sessions. Captures context to help you remember what you worked on.
                </p>
              </div>

              <div className="card p-6">
                <Mail className="w-8 h-8 mb-4" style={{ color: '#8b5cf6' }} />
                <h3 className="font-medium mb-2">Daily & Weekly Reports</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Receive summaries of your productivity, accomplishments, and areas for improvement delivered to your inbox.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
            <FAQSection items={faqItems} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-3xl text-center">
            <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Our support team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@only-works.com" className="btn btn-primary">
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <Link href="/contact" className="btn btn-secondary">
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

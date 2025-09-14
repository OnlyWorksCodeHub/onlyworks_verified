import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/Footer'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-10">
              <Link href="/" className="flex items-center space-x-2">
                <Logo size={32} />
                <span className="text-2xl font-semibold text-gray-900">OnlyWorks</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-base">Pricing</Link>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900 text-base">Careers</Link>
                <Link href="/updates" className="text-gray-600 hover:text-gray-900 text-base">Updates</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-base">Contact</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/coming-soon" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-base">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Security</h1>
            <p className="text-gray-600 mt-1">Your security is our top priority. Learn about our comprehensive security measures.</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
              <p className="text-gray-600 mb-4">
                OnlyWorks employs enterprise-grade security measures to protect your data and ensure the integrity of your work verification.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• End-to-end encryption for all data transmission</li>
                <li>• AES-256 encryption for data at rest</li>
                <li>• Zero-knowledge architecture for sensitive data</li>
                <li>• Regular security audits and penetration testing</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Controls</h2>
              <p className="text-gray-600 mb-4">
                You maintain complete control over your data and what information is included in verification reports.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Granular privacy settings for data collection</li>
                <li>• Customizable report visibility controls</li>
                <li>• Automatic data retention policies</li>
                <li>• Right to data deletion and export</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Infrastructure Security</h2>
              <p className="text-gray-600 mb-4">
                Our infrastructure is built on industry-leading cloud platforms with multiple layers of security.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• SOC 2 Type II compliant infrastructure</li>
                <li>• Multi-factor authentication for all accounts</li>
                <li>• Network isolation and firewall protection</li>
                <li>• 24/7 security monitoring and incident response</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compliance</h2>
              <p className="text-gray-600 mb-4">
                We adhere to international security standards and regulatory requirements.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• GDPR compliant data processing</li>
                <li>• CCPA compliance for California residents</li>
                <li>• ISO 27001 security management standards</li>
                <li>• Regular compliance audits and certifications</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting Security Issues</h2>
              <p className="text-gray-600 mb-4">
                If you discover a security vulnerability, please report it responsibly.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> security@onlyworks.com
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Response Time:</strong> Within 24 hours for critical issues
                </p>
                <p className="text-gray-600">
                  Please include detailed information about the vulnerability and steps to reproduce it.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
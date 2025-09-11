import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Content */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: January 1, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using OnlyWorks, you agree to be bound by these Terms of Service. If you disagree 
                with any part of these terms, you may not access our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                OnlyWorks provides productivity tracking and verification services through screenshot capture, 
                AI analysis, and report generation. The service is designed to help professionals prove their 
                work is genuine and efficient.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p className="mb-4">To use OnlyWorks, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years old</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to circumvent or manipulate the tracking system</li>
                <li>Upload malicious code or interfere with the service</li>
                <li>Impersonate others or provide false information</li>
                <li>Use automation tools to fake productivity</li>
                <li>Share your account with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Payment Terms</h2>
              <p className="mb-4">
                For paid subscriptions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payments are processed securely through Stripe</li>
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>Refunds are available within 14 days of purchase</li>
                <li>Prices may change with 30 days notice</li>
                <li>You're responsible for all applicable taxes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <p>
                OnlyWorks retains all rights to our service, including our software, designs, and trademarks. 
                You retain ownership of your work data and content. By using our service, you grant us a license 
                to process and analyze your data to provide our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy and Data</h2>
              <p>
                Your use of OnlyWorks is governed by our Privacy Policy. We take data security seriously and 
                implement industry-standard measures to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers</h2>
              <p>
                OnlyWorks is provided "as is" without warranties of any kind. We do not guarantee that the service 
                will be uninterrupted or error-free. We are not responsible for any losses or damages resulting 
                from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, OnlyWorks shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold OnlyWorks harmless from any claims, losses, or damages arising 
                from your use of the service or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Termination</h2>
              <p>
                We may terminate or suspend your account at any time for violations of these terms. You may 
                cancel your account at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
              <p>
                These terms are governed by the laws of Delaware, United States, without regard to conflict of 
                law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. We will notify users of any material changes via email 
                or through the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                Email: legal@onlyworks.com<br />
                Address: OnlyWorks Inc., Worldwide (Remote)
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

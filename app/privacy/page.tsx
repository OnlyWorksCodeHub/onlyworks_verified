import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Content */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: January 1, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                OnlyWorks collects information to provide and improve our productivity verification services. We collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (email, name, company)</li>
                <li>Work session data (screenshots, activity patterns, timestamps)</li>
                <li>Usage analytics (features used, session duration)</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide productivity tracking and verification services</li>
                <li>Generate work reports and analytics</li>
                <li>Detect fraud and automation</li>
                <li>Improve our AI models and services</li>
                <li>Communicate with you about your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your data. All screenshots and session data 
                are encrypted in transit and at rest. We use secure cloud infrastructure with regular security audits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Retention</h2>
              <p>
                We retain your work session data according to your subscription plan. Free users: 7 days, 
                Professional: 90 days, Team: Unlimited. You can delete your data at any time from your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing</h2>
              <p className="mb-4">
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers who help us operate our platform</li>
                <li>When you generate public verification reports (only sanitized summaries)</li>
                <li>If required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
              <p>
                We use essential cookies to maintain your session and preferences. We also use analytics cookies 
                to understand how you use our service. You can control cookie preferences in your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
              <p>
                OnlyWorks is not intended for users under 18 years of age. We do not knowingly collect information 
                from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
              <p>
                If you have questions about this privacy policy, please contact us at:
              </p>
              <p className="mt-2">
                Email: privacy@onlyworks.com<br />
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

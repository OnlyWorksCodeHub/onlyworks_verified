import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/layout/MobileNavigation'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out OnlyWorks',
      features: [
        '3 sessions per month',
        'Basic productivity tracking',
        'Simple reports',
        '7-day data retention',
        'Email support'
      ],
      limitations: [
        'No AI analysis',
        'No public reports',
        'No team features'
      ],
      cta: 'Start Free',
      highlighted: false
    },
    {
      name: 'Professional',
      price: '$19',
      period: '/month',
      description: 'For freelancers and remote workers',
      features: [
        'Unlimited sessions',
        'AI-powered analysis',
        'Public verification reports',
        'Advanced fraud detection',
        '90-day data retention',
        'Priority support',
        'Custom branding',
        'CSV exports'
      ],
      limitations: [],
      cta: 'Start Trial',
      highlighted: true
    },
    {
      name: 'Team',
      price: '$29',
      period: '/user/month',
      description: 'For teams and agencies',
      features: [
        'Everything in Professional',
        'Team dashboard',
        'Manager insights',
        'Client portals',
        'Unlimited data retention',
        'API access',
        'SSO authentication',
        'Dedicated support',
        'Custom integrations'
      ],
      limitations: [],
      cta: 'Contact Sales',
      highlighted: false
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <MobileNavigation currentPage="/pricing" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-3 xs:px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold md:font-semibold text-gray-900 mb-6 leading-tight sm:leading-snug md:leading-normal">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? 'bg-white border-2 border-primary shadow-xl shadow-primary/20'
                    : 'bg-gray-50 border border-gray-200'
                } rounded-lg p-8`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-semibold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <X className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  {plan.name === 'Team' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/contact"
                        className="flex items-center justify-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg font-medium transition text-sm"
                      >
                        Contact Sales
                      </Link>
                      <Link
                        href="/teams"
                        className="flex items-center justify-center py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition text-sm"
                      >
                        More Info
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/coming-soon"
                      className={`w-full block text-center py-3 rounded-lg font-medium transition ${
                        plan.highlighted
                          ? 'bg-primary hover:bg-primary-dark text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the free trial work?</h3>
              <p className="text-gray-600">
                You get 14 days of full Professional features, no credit card required.
                After the trial, you can continue with the free plan or upgrade.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade, downgrade, or cancel your plan at any time.
                Changes take effect at the next billing cycle.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data private?</h3>
              <p className="text-gray-600">
                Absolutely. Your screenshots and data are encrypted and never shared.
                Only you can generate public reports, and they only contain sanitized summaries.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer discounts?</h3>
              <p className="text-gray-600">
                Yes! We offer 20% off for annual billing and volume discounts for teams over 10 users.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

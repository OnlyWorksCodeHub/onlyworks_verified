import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Check, X } from 'lucide-react'

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
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? 'bg-[#1A1A1A] border-2 border-[#5E5CE6] shadow-xl shadow-[#5E5CE6]/20'
                    : 'bg-[#1A1A1A] border border-gray-800'
                } rounded-lg p-8`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#5E5CE6] text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <X className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className={`w-full block text-center py-3 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? 'bg-[#5E5CE6] hover:bg-[#4E4CD6] text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">How does the free trial work?</h3>
              <p className="text-gray-400">
                You get 14 days of full Professional features, no credit card required. 
                After the trial, you can continue with the free plan or upgrade.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-400">
                Yes! You can upgrade, downgrade, or cancel your plan at any time. 
                Changes take effect at the next billing cycle.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Is my data private?</h3>
              <p className="text-gray-400">
                Absolutely. Your screenshots and data are encrypted and never shared. 
                Only you can generate public reports, and they only contain sanitized summaries.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Do you offer discounts?</h3>
              <p className="text-gray-400">
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

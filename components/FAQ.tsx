'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel from settings whenever you want. You'll keep full access until your billing period ends."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes. Get 14 days free on the Pro plan. Card required but not charged until trial ends."
  },
  {
    question: "What payment methods do you accept?",
    answer: "All major cards via Stripe. Enterprise clients can pay by invoice."
  },
  {
    question: "What happens to my work data?",
    answer: "You own it. Export your verified reports anytime. If you cancel, data is deleted after 30 days—or immediately if you prefer."
  },
  {
    question: "How does work verification work?",
    answer: "You control what gets verified. Our AI analyzes your work patterns to create proof of authenticity you can share with employers or clients. Perfect for building a credible portfolio."
  },
  {
    question: "Do you record my screen?",
    answer: "No video recording. You control when verification snapshots happen. Everything stays private unless you choose to include it in a report you share."
  },
  {
    question: "Can I use OnlyWorks on multiple devices?",
    answer: "Yes. Pro and Enterprise plans let you verify work across unlimited devices."
  },
  {
    question: "How do you protect my privacy?",
    answer: "End-to-end encryption. You decide what goes into reports. We never sell your data. You control who sees your verified work—clients, employers, or keep it private."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes. Full refund within 14 days if you're not satisfied, no questions asked."
  },
  {
    question: "Is there an API?",
    answer: "Yes. Enterprise plans include full API access for custom integrations."
  },
  {
    question: "How accurate is the work verification?",
    answer: "98% accuracy in authenticating genuine work. Continuously improving through machine learning. Helps you stand out by proving your work is real."
  },
  {
    question: "Can I customize my verification reports?",
    answer: "Yes. Enterprise plans include custom branding so your reports reflect your personal or company brand."
  },
  {
    question: "What tools does OnlyWorks integrate with?",
    answer: "Slack, Teams, Notion, and more. Enterprise plans support custom integrations for your workflow."
  },
  {
    question: "Is there a desktop app?",
    answer: "Yes. Available for macOS and Windows. Download it to start building your verified work portfolio."
  },
  {
    question: "How do I get support?",
    answer: "Email support for all plans. Pro and Enterprise get priority support with a dedicated rep."
  },
  {
    question: "Can I pause my subscription?",
    answer: "Yes. Pause for up to 3 months and resume whenever you're ready."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section" style={{ background: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Everything you need to know about building your verified work portfolio.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card cursor-pointer transition-all hover:border-[var(--text-muted)]"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="mb-2 text-base font-medium">{faq.question}</h3>
                    {openIndex === index && (
                      <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    style={{ color: 'var(--text-muted)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

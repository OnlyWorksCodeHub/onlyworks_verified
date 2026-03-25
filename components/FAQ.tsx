'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How does work verification work?",
    answer: "You control what gets verified. OnlyWorks captures your work activity — apps used, time spent, what you built — and AI turns it into a verified report with your skills, accomplishments, and impact. You decide what goes into each report and who can see it."
  },
  {
    question: "Do you record my screen?",
    answer: "OnlyWorks takes periodic screenshots to understand what you're working on, but you control when capture happens and can exclude any apps. Screenshots are analyzed locally and never shared — only the AI-generated insights make it into your reports."
  },
  {
    question: "What happens to my work data?",
    answer: "You own it. Your data is encrypted and never shared without your permission. Export your verified reports anytime. If you cancel, data is deleted after 30 days — or immediately if you prefer."
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. OnlyWorks is free to get started. Generate reports, build your OW Profile, and share verified proof of your work at no cost."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel from settings whenever you want. You'll keep full access until your billing period ends. Full refund within 14 days if you're not satisfied."
  },
  {
    question: "Is there a desktop app?",
    answer: "Yes. Available for macOS (Apple Silicon and Intel) and Windows. Download it from our downloads page to start building your verified work portfolio."
  },
  {
    question: "What tools does OnlyWorks work with?",
    answer: "OnlyWorks runs in the background and watches whatever tools you use — VS Code, Figma, Chrome, Slack, Terminal, and anything else. No integrations needed. It observes your natural workflow."
  },
  {
    question: "How do I get support?",
    answer: "Email us at contact@only-works.com or use the contact form on our website. We respond within 24 hours."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 md:py-24 px-4 md:px-6" style={{ background: 'var(--bg-alt)' }}>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2>Questions? Answers.</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left cursor-pointer"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-medium">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </div>
                </button>
                {openIndex === index && (
                  <div id={`faq-answer-${index}`} role="region" aria-label={faq.question}>
                    <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

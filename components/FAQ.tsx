'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: "How does work verification work?", a: "You control what gets verified. OnlyWorks captures your work activity — apps used, time spent, what you built — and AI turns it into a verified report with your skills, accomplishments, and impact. You decide what goes into each report and who can see it." },
  { q: "Do you record my screen?", a: "OnlyWorks takes periodic screenshots to understand what you're working on, but you control when capture happens and can exclude any apps. Screenshots are analyzed locally and never shared — only the AI-generated insights make it into your reports." },
  { q: "What happens to my work data?", a: "You own it. Your data is encrypted and never shared without your permission. Export your verified reports anytime. If you cancel, data is deleted after 30 days — or immediately if you prefer." },
  { q: "Is there a free plan?", a: "Yes. OnlyWorks is free to get started. Generate reports, build your OW Profile, and share verified proof of your work at no cost." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from settings whenever you want. You'll keep full access until your billing period ends. Full refund within 14 days if you're not satisfied." },
  { q: "Is there a desktop app?", a: "Yes. Available for macOS (Apple Silicon and Intel) and Windows. Download it from our downloads page to start building your verified work portfolio." },
  { q: "What tools does OnlyWorks work with?", a: "OnlyWorks runs in the background and watches whatever tools you use — VS Code, Figma, Chrome, Slack, Terminal, and anything else. No integrations needed. It observes your natural workflow." },
  { q: "How do I get support?", a: "Email us at contact@only-works.com or use the contact form on our website. We respond within 24 hours." },
]

export function FAQ() {
  const [open, setOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-28 px-6 border-t" style={{ borderColor: '#dad7d0', background: '#fafaf9' }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 rounded-lg border cursor-pointer transition-colors"
          style={{ background: '#ffffff', borderColor: '#dad7d0' }}
        >
          <h2 className="text-xl md:text-2xl font-display" style={{ color: '#080503' }}>
            Questions? Answers.
          </h2>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            style={{ color: '#a3a19b' }}
          />
        </button>

        {open && (
          <div className="mt-2 rounded-lg border overflow-hidden divide-y divide-[#e7e4dd]" style={{ background: '#ffffff', borderColor: '#dad7d0' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderColor: '#e7e4dd' }}>
                <button
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  className="w-full text-left px-6 py-3.5 flex items-center justify-between gap-4 cursor-pointer transition-colors hover:bg-[#f5f5f4]"
                  aria-expanded={expandedIndex === i}
                >
                  <span className="text-sm font-medium" style={{ color: '#080503' }}>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      expandedIndex === i ? 'rotate-180' : ''
                    }`}
                    style={{ color: '#a3a19b' }}
                  />
                </button>
                {expandedIndex === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed" style={{ color: '#44423d' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

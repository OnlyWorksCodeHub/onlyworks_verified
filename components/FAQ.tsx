'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: "How does work verification work?", a: "You control what gets verified. OnlyWorks verifies your work activity and turns it into a report with your skills, accomplishments and impact. You decide what goes into each report and who can see it." },
  { q: "Do you record my screen?", a: "OnlyWorks takes periodic screenshots to understand what you're working on, but you control when this happens and can exclude any apps. Screenshots are never shared. Only the generated insights make it into your reports." },
  { q: "What happens to my personal data?", a: "You own it. Your personal data is encrypted and never shared without your permission. Export your verified reports anytime. If you cancel, your personal data is deleted after 30 days, or immediately if you prefer. For full details, see our Terms of Service and Privacy Policy." },
  { q: "Is it free?", a: "Yes. For job seekers, OnlyWorks is free to verify your work. Generate reports, build your OW Profile and share verified proof at no cost. If you're a business looking for talent, visit our hiring page for more information." },
  { q: "Is there a desktop app?", a: "Yes. Available for macOS (Apple Silicon and Intel) and Windows. Download it from our downloads page to start building your verified work portfolio." },
  { q: "What tools does OnlyWorks work with?", a: "OnlyWorks runs in the background and verifies your work across whatever tools you use: VS Code, Figma, Chrome, Slack, Terminal and more. No integrations needed. It fits into your natural workflow." },
  { q: "How do I get support?", a: "Email us at contact@only-works.com or use the contact form on our website. We respond within 24-48 hours." },
]

export function FAQ() {
  const [open, setOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-28 px-6 border-t border-foreground/10 bg-background">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 border border-foreground/10 cursor-pointer transition-colors hover:bg-foreground/[0.02]"
        >
          <h2 className="text-xl md:text-2xl font-display">
            Questions? Answers.
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="mt-2 border border-foreground/10 overflow-hidden divide-y divide-foreground/5">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  className="w-full text-left px-6 py-3.5 flex items-center justify-between gap-4 cursor-pointer transition-colors hover:bg-foreground/[0.02]"
                  aria-expanded={expandedIndex === i}
                >
                  <span className="text-sm font-medium">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      expandedIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedIndex === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
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

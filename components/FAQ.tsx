'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  { q: "Is it really just an app I download?", a: "Yes. OnlyWorks is a free desktop app for macOS (Apple Silicon and Intel) and Windows. Sign in with Google, LinkedIn or email to get started." },
  { q: "What does OnlyWorks capture?", a: "While a session is running, it captures your on-screen work to build your report — and it only runs during sessions you start and stop. For exactly what's captured, who processes it, and how it's handled, see our Privacy Policy and Security page." },
  { q: "Is this spyware?", a: "No. It only runs during sessions you start, it's a tool you use on your own work to build your own portfolio, and you decide what to share. The full picture of what's captured and how it's handled is on our Privacy and Security pages." },
  { q: "What does “verified” mean?", a: "Your report is built from your real work during sessions, and an AI corroborates each skill against that work — so it's backed by evidence, not a self-reported claim. It isn't cryptographic or identity verification." },
  { q: "How is this different from a resume or LinkedIn?", a: "Those are self-reported claims. OnlyWorks reports are built from your real work sessions — actual skills, accomplishments and impact — and you decide what's shown and who can see it." },
  { q: "Is it free?", a: "Yes, for job seekers. Generate reports, build your OW Profile and share verified proof at no cost. Hiring teams have paid plans — see our hiring page." },
  { q: "What tools does OnlyWorks work with?", a: "OnlyWorks runs alongside whatever you already use — VS Code, Figma, Chrome, Slack, Terminal and more. No integrations to set up; it fits into your normal workflow." },
  { q: "How do I get support?", a: "Email us at contact@only-works.com or use the contact form on our website. We respond within 24-48 hours." },
]

export function FAQ() {
  const [open, setOpen] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="py-12 md:py-16 px-6 border-t border-foreground/10 bg-background">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-4 px-6 py-4 border border-foreground/10 cursor-pointer transition-colors hover:bg-foreground/[0.02]"
          aria-expanded={open}
        >
          <h2 className="text-xl md:text-2xl font-display">
            Still skeptical? Fair.
          </h2>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden border border-foreground/10 divide-y divide-foreground/5">
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
                <div
                  className={`px-6 overflow-hidden transition-all duration-200 ${
                    expandedIndex === i ? 'max-h-96 pb-4' : 'max-h-0'
                  }`}
                >
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About OnlyWorks | Proof of Work, Not Resume Claims',
  description: 'Why OnlyWorks is replacing unverifiable resumes with proof from real work: captured sessions, AI-corroborated skills, and one shareable profile.',
  alternates: {
    canonical: 'https://www.only-works.com/about',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is OnlyWorks a resume builder?', acceptedAnswer: { '@type': 'Answer', text: 'No. OnlyWorks replaces the resume rather than reformatting it — it turns real work sessions into evidence-backed reports, not another place to type claims about yourself.' } },
    { '@type': 'Question', name: 'Is this identity or cryptographic verification?', acceptedAnswer: { '@type': 'Answer', text: '"Verified" means a skill was corroborated against your real captured work — it isn\'t an identity check, a certificate, or cryptography.' } },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <AboutClient />
    </>
  )
}
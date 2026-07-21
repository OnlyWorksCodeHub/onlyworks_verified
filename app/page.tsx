import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'OnlyWorks: The New Resume Built From Real Work',
  description: 'Anyone can write a resume. OnlyWorks turns real work sessions into verified reports and one shareable profile, free for job seekers on Mac and Windows.',
  alternates: {
    canonical: 'https://www.only-works.com',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OnlyWorks',
  url: 'https://www.only-works.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.only-works.com/images/logo.png',
    width: 500,
    height: 500,
  },
  description: 'OnlyWorks is the new resume: a desktop app that turns real work sessions into evidence-backed, AI-corroborated reports and one shareable profile.',
  email: 'contact@only-works.com',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/OnlyWorksAI',
    'https://www.linkedin.com/company/only-works',
    'https://www.youtube.com/@OnlyWorksAI',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OnlyWorks',
  url: 'https://www.only-works.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.only-works.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const softwareApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OnlyWorks',
  description: 'Desktop app that turns real work sessions into evidence-backed, AI-corroborated reports and one shareable profile.',
  url: 'https://www.only-works.com/downloads',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'macOS, Windows',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is it really just an app I download?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. OnlyWorks is a free desktop app for macOS (Apple Silicon and Intel) and Windows. Sign in with Google, LinkedIn or email to get started.' } },
    { '@type': 'Question', name: 'What does OnlyWorks capture?', acceptedAnswer: { '@type': 'Answer', text: "While a session is running, it captures your on-screen work to build your report — and it only runs during sessions you start and stop. For exactly what's captured, who processes it, and how it's handled, see our Privacy Policy and Security page." } },
    { '@type': 'Question', name: 'Is this spyware?', acceptedAnswer: { '@type': 'Answer', text: "No. It only runs during sessions you start, it's a tool you use on your own work to build your own portfolio, and you decide what to share. The full picture of what's captured and how it's handled is on our Privacy and Security pages." } },
    { '@type': 'Question', name: 'What does "verified" mean?', acceptedAnswer: { '@type': 'Answer', text: "Your report is built from your real work during sessions, and an AI corroborates each skill against that work — so it's backed by evidence, not a self-reported claim. It isn't cryptographic or identity verification." } },
    { '@type': 'Question', name: 'How is this different from a resume or LinkedIn?', acceptedAnswer: { '@type': 'Answer', text: "Those are self-reported claims. OnlyWorks reports are built from your real work sessions — actual skills, accomplishments and impact — and you decide what's shown and who can see it." } },
    { '@type': 'Question', name: 'Is it free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, for job seekers. Generate reports, build your OW Profile and share verified proof at no cost. Hiring teams have paid plans — see our hiring page.' } },
    { '@type': 'Question', name: 'What tools does OnlyWorks work with?', acceptedAnswer: { '@type': 'Answer', text: 'OnlyWorks runs alongside whatever you already use — VS Code, Figma, Chrome, Slack, Terminal and more. No integrations to set up; it fits into your normal workflow.' } },
    { '@type': 'Question', name: 'How do I get support?', acceptedAnswer: { '@type': 'Answer', text: 'Email us at contact@only-works.com or use the contact form on our website. We respond within 24-48 hours.' } },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  )
}
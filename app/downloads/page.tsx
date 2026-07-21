import type { Metadata } from 'next'
import DownloadsClient from './DownloadsClient'

export const metadata: Metadata = {
  title: 'Download OnlyWorks for Mac & Windows - Free',
  description: 'Download the free OnlyWorks desktop app for macOS (Apple Silicon or Intel) or Windows. Turn real work sessions into evidence-backed reports and one shareable profile.',
  alternates: {
    canonical: 'https://www.only-works.com/downloads',
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

export default function DownloadsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <DownloadsClient />
    </>
  )
}
import type { Metadata } from 'next'
import CareersClient from './CareersClient'

export const metadata: Metadata = {
  title: 'Careers at OnlyWorks',
  description: "OnlyWorks is a small team that isn't actively hiring right now. See how to get considered when roles open, or join the Talent Community instead.",
  alternates: {
    canonical: 'https://www.only-works.com/careers',
  },
}

export default function CareersPage() {
  return <CareersClient />
}

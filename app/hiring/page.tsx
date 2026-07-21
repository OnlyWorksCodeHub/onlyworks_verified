import type { Metadata } from 'next'
import HiringClient from './HiringClient'

export const metadata: Metadata = {
  title: 'Hire on Proof, Not Resumes | OnlyWorks for Employers',
  description: 'Search candidates by verified skills and read the evidence from real work sessions. Candidate search is free and open now; the full hiring toolkit is on a waitlist.',
  alternates: {
    canonical: 'https://www.only-works.com/hiring',
  },
}

export default function HiringPage() {
  return <HiringClient />
}
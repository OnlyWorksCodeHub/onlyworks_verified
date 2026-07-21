import type { Metadata } from 'next'
import VerifySkillsClient from './VerifySkillsClient'

export const metadata: Metadata = {
  title: 'Verify Skills | OnlyWorks',
  description: 'See what a verified skill on an OnlyWorks report actually means and how it was corroborated against real work.',
  alternates: {
    canonical: 'https://www.only-works.com/verify-skills',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function VerifySkillsPage() {
  return <VerifySkillsClient />
}
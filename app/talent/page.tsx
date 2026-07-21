import type { Metadata } from 'next'
import TalentClient from './TalentClient'

export const metadata: Metadata = {
  title: 'Join the OnlyWorks Talent Community | Get Found for Real Work',
  description: 'Add the roles you want, back your skills with proof from real work sessions, and surface when hiring teams search. Free, double-opt-in, remove yourself anytime.',
  alternates: {
    canonical: 'https://www.only-works.com/talent',
  },
}

export default function TalentCommunityPage() {
  return <TalentClient />
}
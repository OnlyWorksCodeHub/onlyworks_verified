import type { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy | OnlyWorks',
  description: 'What OnlyWorks collects during captured work sessions, who processes it, retention periods, and how to delete your data.',
  alternates: {
    canonical: 'https://www.only-works.com/privacy',
  },
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
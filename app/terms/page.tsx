import type { Metadata } from 'next'
import TermsClient from './TermsClient'

export const metadata: Metadata = {
  title: 'Terms of Service | OnlyWorks',
  description: 'The terms that govern your use of the OnlyWorks website, desktop app, profiles, reports, and related services.',
  alternates: {
    canonical: 'https://www.only-works.com/terms',
  },
}

export default function TermsPage() {
  return <TermsClient />
}
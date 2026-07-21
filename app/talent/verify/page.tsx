import type { Metadata } from 'next'
import VerifyTalentClient from './VerifyTalentClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function VerifyTalentPage() {
  return <VerifyTalentClient />
}
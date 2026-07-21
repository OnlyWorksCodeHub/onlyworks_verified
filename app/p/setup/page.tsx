import type { Metadata } from 'next'
import ProfileSetupClient from './ProfileSetupClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function ProfileSetupPage() {
  return <ProfileSetupClient />
}
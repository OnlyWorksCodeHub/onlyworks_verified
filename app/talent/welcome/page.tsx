import type { Metadata } from 'next'
import WelcomeClient from './WelcomeClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function WelcomePage() {
  return <WelcomeClient />
}
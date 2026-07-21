import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return <LoginClient />
}

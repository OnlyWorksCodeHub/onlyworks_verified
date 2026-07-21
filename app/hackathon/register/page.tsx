import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function RegisterPage() {
  return <RegisterClient />
}

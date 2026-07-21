import type { Metadata } from 'next'
import ApplyClient from './ApplyClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function ApplyPage() {
  return <ApplyClient />
}
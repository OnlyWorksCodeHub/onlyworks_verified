import type { Metadata } from 'next'
import SupportTicketsClient from './SupportTicketsClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function SupportTicketsPage() {
  return <SupportTicketsClient />
}
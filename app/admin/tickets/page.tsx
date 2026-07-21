import type { Metadata } from 'next'
import AdminTicketsClient from './AdminTicketsClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function AdminTicketsPage() {
  return <AdminTicketsClient />
}

import type { Metadata } from 'next'
import AdminPayoutsClient from './AdminPayoutsClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function AdminPayoutsPage() {
  return <AdminPayoutsClient />
}
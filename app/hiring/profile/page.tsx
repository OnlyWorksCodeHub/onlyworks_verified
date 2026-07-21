import type { Metadata } from 'next'
import HiringProfileClient from './HiringProfileClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function HiringProfilePage() {
  return <HiringProfileClient />
}
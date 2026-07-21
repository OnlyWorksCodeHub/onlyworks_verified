import type { Metadata } from 'next'
import ScheduleClient from './ScheduleClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function SchedulePage() {
  return <ScheduleClient />
}
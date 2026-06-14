import type { Metadata, Viewport } from 'next'
import './hackathon.css'
import { HackathonNav } from '@/components/hackathon/HackathonNav'
import { HackathonFooter } from '@/components/hackathon/HackathonFooter'

export const metadata: Metadata = {
  title: "ONLYHACKS for the ONLYWEIRD '26.",
  description:
    "ONLYHACKS for the ONLYWEIRD '26 is OnlyWorks' first hackathon, co-hosted with Orbis: a 48-hour online sprint + live-streamed finals. Build the thing you'd never put on a resume. Prove it ran (at least once). Demo it to a stranger. June 18 — 20, 2026.",
  openGraph: {
    title: "ONLYHACKS for the ONLYWEIRD '26.",
    description:
      "Hosted by OnlyWorks × Orbis. Build the thing you'd never put on a resume. Prove it ran (at least once). Demo it to a stranger. June 18 — 20, 2026.",
    siteName: "ONLYHACKS for the ONLYWEIRD '26",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ONLYHACKS for the ONLYWEIRD '26.",
    description: 'Hosted by OnlyWorks × Orbis. June 18 — 20, 2026. Fully online.',
  },
}

export const viewport: Viewport = {
  themeColor: '#f1ece2',
  width: 'device-width',
  initialScale: 1,
}

export default function HackathonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hackathon-shell">
      <HackathonNav />
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <HackathonFooter />
    </div>
  )
}

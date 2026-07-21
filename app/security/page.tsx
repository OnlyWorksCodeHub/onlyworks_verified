import type { Metadata } from 'next'
import SecurityClient from './SecurityClient'

export const metadata: Metadata = {
  title: 'OnlyWorks Security & Privacy | What We Capture and How to Delete It',
  description: 'Exactly what OnlyWorks captures during sessions - screenshots, OCR text, app titles, click/keystroke counts - who processes it, and how deletion works.',
  alternates: {
    canonical: 'https://www.only-works.com/security',
  },
}

export default function SecurityPage() {
  return <SecurityClient />
}
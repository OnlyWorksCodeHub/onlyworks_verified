import type { Metadata } from 'next'
import CertificateClient from './CertificateClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function CertificatePage() {
  return <CertificateClient />
}
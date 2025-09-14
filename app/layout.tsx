import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL('https://onlyworks.com'),
  title: 'OnlyWorks | AI Platform built for professionals and specialists. Making your work undeniable, minus the headache.',
  description: 'Making your work undeniable with AI-powered verification. Detect automation, generate verified reports, and prove your productivity - minus the headache. Trusted by professionals worldwide.',
  keywords: [
    'AI platform',
    'work verification',
    'productivity tracking',
    'automation detection',
    'verified reports',
    'professional specialists',
    'AI analysis',
    'work authentication',
    'productivity verification',
    'tamper-proof reports',
    'real-time tracking',
    'OnlyWorks',
    'undeniable work'
  ],
  authors: [{ name: 'OnlyWorks Team' }],
  creator: 'OnlyWorks',
  publisher: 'OnlyWorks',
  category: 'productivity',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onlyworks.com',
    siteName: 'OnlyWorks',
    title: 'OnlyWorks | AI Platform Built for Professionals and Specialists',
    description: 'Making your work undeniable with AI-powered verification. Detect automation, generate verified reports, and prove your productivity - minus the headache.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OnlyWorks | AI Platform for Work Verification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@onlyworks',
    creator: '@onlyworks',
    title: 'OnlyWorks | AI Platform Built for Professionals and Specialists',
    description: 'Making your work undeniable with AI-powered verification. Detect automation and generate verified reports.',
    images: ['/images/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://onlyworks.com',
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "OnlyWorks",
              "description": "AI platform built for professionals and specialists. Making your work undeniable with verified reports and automation detection.",
              "url": "https://onlyworks.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Cross-platform",
              "offers": {
                "@type": "Offer",
                "price": "100000000000000000000",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "OnlyWorks",
                "url": "https://onlyworks.com"
              },
              "keywords": "AI platform, work verification, productivity tracking, automation detection, verified reports"
            })
          }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased font-sans">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'Inter', sans-serif",
              background: 'white',
              color: '#111827',
              border: '1px solid #e5e7eb'
            },
            duration: 4000,
            success: {
              style: {
                background: '#10b981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#ef4444',
                color: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  )
}

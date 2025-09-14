import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL('https://only-works.com'),
  title: 'OnlyWorks | AI Platform built for professionals and specialists. Making your work undeniable',
  description: 'Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.',
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
    url: 'https://only-works.com',
    siteName: 'OnlyWorks',
    title: 'OnlyWorks | AI Platform built for professionals and specialists. Making your work undeniable',
    description: 'Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.',
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
    site: '@OnlyWorksAI',
    creator: '@OnlyWorksAI',
    title: 'OnlyWorks | AI Platform built for professionals and specialists. Making your work undeniable',
    description: 'Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.',
    images: ['/images/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://only-works.com',
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'theme-color': '#ffffff',
    // LinkedIn meta tags
    'linkedin:title': 'OnlyWorks | AI Platform built for professionals and specialists. Making your work undeniable',
    'linkedin:description': 'Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.',
    'linkedin:image': '/images/linkedin-image.png',
    'linkedin:url': 'https://only-works.com',
    // YouTube meta tags
    'youtube:title': 'AI Platform built for professionals and specialists. Making your work undeniable | OnlyWorks',
    'youtube:description': 'Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.',
    'youtube:image': '/images/youtube-image.png',
    'youtube:url': 'https://only-works.com',
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
              "description": "Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.",
              "url": "https://only-works.com",
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
                "url": "https://only-works.com"
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

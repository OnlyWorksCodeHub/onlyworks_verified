// Vercel deployment sync - 2025-10-20
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.only-works.com'),
  title: 'OnlyWorks | AI Platform to Make your Work Undeniable',
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
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.only-works.com',
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
    canonical: 'https://www.only-works.com',
  },
  other: {
    'msapplication-TileColor': '#5c5ce6',
    'theme-color': '#5c5ce6',
    'color-scheme': 'light dark',
    'rating': 'general',
    'revisit-after': '7 days',
    'google-site-verification': 'pending', // Add your verification code from Google Search Console
    // Performance hints
    'dns-prefetch': 'https://fonts.googleapis.com',
    'preconnect': 'https://fonts.gstatic.com',
    // LinkedIn meta tags
    'linkedin:title': 'OnlyWorks | AI Platform built for professionals and specialists. Making your work undeniable',
    'linkedin:description': 'Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.',
    'linkedin:image': '/images/linkedin-image.png',
    'linkedin:url': 'https://www.only-works.com',
    // YouTube meta tags
    'youtube:title': 'AI Platform built for professionals and specialists. Making your work undeniable | OnlyWorks',
    'youtube:description': 'Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.',
    'youtube:image': '/images/youtube-image.png',
    'youtube:url': 'https://www.only-works.com',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Perfect+Ninety-Three:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "OnlyWorks",
              "alternateName": "OnlyWorks AI Platform",
              "description": "Making your work undeniable. Detect automation, generate verified reports, and prove your productivity. Trusted by professionals worldwide.",
              "url": "https://www.only-works.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Cross-platform",
              "logo": "https://www.only-works.com/images/onlyworks-logo.png",
              "image": "https://www.only-works.com/images/og-image.png",
              "offers": {
                "@type": "Offer",
                "price": "100000000000000000000",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "OnlyWorks",
                "url": "https://www.only-works.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.only-works.com/images/onlyworks-logo.png",
                  "width": 160,
                  "height": 40
                },
                "sameAs": [
                  "https://twitter.com/OnlyWorksAI",
                  "https://www.linkedin.com/company/onlyworks",
                  "https://github.com/onlyworks"
                ]
              },
              "keywords": "AI platform, work verification, productivity tracking, automation detection, verified reports",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.only-works.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased font-sans">
        <ClientLayout>
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
        </ClientLayout>
      </body>
    </html>
  )
}

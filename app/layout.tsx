// Vercel deployment sync - 2025-10-20
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.only-works.com'),
  title: 'OnlyWorks | AI-Powered Work Verification Platform',
  description: 'Prove your work is authentic with OnlyWorks. Our AI detects automation, generates tamper-proof reports, and verifies productivity. Trusted by professionals worldwide.',
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
    title: 'OnlyWorks | AI-Powered Work Verification Platform',
    description: 'Prove your work is authentic with OnlyWorks. Our AI detects automation, generates tamper-proof reports, and verifies productivity. Trusted by professionals worldwide.',
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
    title: 'OnlyWorks | AI-Powered Work Verification Platform',
    description: 'Prove your work is authentic with OnlyWorks. Our AI detects automation, generates tamper-proof reports, and verifies productivity. Trusted by professionals worldwide.',
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
    'google-site-verification': 'nswKY7kAbZl8O4tAwnMpAc0Wwfb7CnmMeZX7lVJtliE',
    // Performance hints
    'dns-prefetch': 'https://fonts.googleapis.com',
    'preconnect': 'https://fonts.gstatic.com',
    // LinkedIn meta tags
    'linkedin:title': 'OnlyWorks | AI-Powered Work Verification Platform',
    'linkedin:description': 'Prove your work is authentic with OnlyWorks. Our AI detects automation, generates tamper-proof reports, and verifies productivity. Trusted by professionals worldwide.',
    'linkedin:image': '/images/linkedin-image.png',
    'linkedin:url': 'https://www.only-works.com',
    // YouTube meta tags
    'youtube:title': 'OnlyWorks | AI-Powered Work Verification Platform',
    'youtube:description': 'Prove your work is authentic with OnlyWorks. Our AI detects automation, generates tamper-proof reports, and verifies productivity. Trusted by professionals worldwide.',
    'youtube:image': '/images/youtube-image.png',
    'youtube:url': 'https://www.only-works.com',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        {/* Favicon - all sizes explicitly defined for search engines */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />


        {/* Performance - Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Invalid font removed - "Perfect Ninety-Three" is not available on Google Fonts */}

        {/* Organization Schema - for Google logo and Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "OnlyWorks",
              "alternateName": "OnlyWorks AI Platform",
              "url": "https://www.only-works.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.only-works.com/images/logo.png",
                "width": 500,
                "height": 500,
                "caption": "OnlyWorks Logo"
              },
              "description": "Prove your work is authentic with OnlyWorks. Our AI detects automation, generates tamper-proof reports, and verifies productivity. Trusted by professionals worldwide.",
              "email": "contact@only-works.com",
              "sameAs": [
                "https://twitter.com/OnlyWorksAI",
                "https://www.linkedin.com/company/only-works",
                "https://www.youtube.com/@OnlyWorksAI"
              ],
              "foundingDate": "2024",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              }
            })
          }}
        />

        {/* SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "OnlyWorks",
              "alternateName": "OnlyWorks AI Platform",
              "description": "Prove your work is authentic with OnlyWorks. Our AI detects automation, generates tamper-proof reports, and verifies productivity. Trusted by professionals worldwide.",
              "url": "https://www.only-works.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Cross-platform",
              "logo": "https://www.only-works.com/images/logo.png",
              "image": "https://www.only-works.com/images/og-image.png",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free to get started"
              },
              "creator": {
                "@type": "Organization",
                "name": "OnlyWorks",
                "url": "https://www.only-works.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.only-works.com/images/logo.png",
                  "width": 500,
                  "height": 500,
                  "caption": "OnlyWorks Logo"
                },
                "image": "https://www.only-works.com/images/logo.png",
                "sameAs": [
                  "https://twitter.com/OnlyWorksAI",
                  "https://www.linkedin.com/company/only-works",
                  "https://www.youtube.com/@OnlyWorksAI"
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
      <body className="antialiased">
        <div className="grid-bg" />
        <div className="grid-dots" />
        <ClientLayout>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "'Inter', sans-serif",
                background: '#1a1a24',
                color: '#ffffff',
                border: '1px solid #3a3138'
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

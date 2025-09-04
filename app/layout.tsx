import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/contexts/theme-context'
import Script from 'next/script'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
})

export const metadata: Metadata = {
  title: 'AI Productivity & Project Verification Platform | OnlyWorks',
  description: 'Boost productivity with OnlyWorks, the AI platform that generates reports, verifies projects, and simplifies workflows for smarter business management.',
  keywords: 'AI productivity platform, project verification, workflow optimization, performance tracking, talent matching',
  authors: [{ name: 'OnlyWorks' }],
  creator: 'OnlyWorks',
  publisher: 'OnlyWorks',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://only-works.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Productivity & Project Verification Platform | OnlyWorks',
    description: 'Boost productivity with OnlyWorks, the AI platform that generates reports, verifies projects, and simplifies workflows for smarter business management.',
    url: 'https://only-works.com',
    siteName: 'OnlyWorks',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OnlyWorks - AI Productivity & Project Verification Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Productivity & Project Verification Platform | OnlyWorks',
    description: 'Boost productivity with OnlyWorks, the AI platform that generates reports, verifies projects, and simplifies workflows for smarter business management.',
    images: ['/og-image.png'],
    creator: '@onlyworks',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
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
}

// Structured Data for Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OnlyWorks",
  "url": "https://only-works.com",
  "logo": "https://only-works.com/logo.png",
  "sameAs": [
    "https://twitter.com/onlyworks",
    "https://www.linkedin.com/company/onlyworks",
    "https://instagram.com/onlyworks3"
  ],
  "description": "OnlyWorks is an AI productivity and project verification platform. We help businesses streamline workflows, track employee performance, and connect with reliable talent faster."
}

// Structured Data for WebSite
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OnlyWorks",
  "url": "https://only-works.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://only-works.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "description": "Boost productivity with OnlyWorks, the AI platform that generates reports, verifies projects, and simplifies workflows for smarter business management."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ClientLayout from '@/components/ClientLayout'
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.only-works.com'),
  title: 'OnlyWorks | AI-Powered Work Verification Platform',
  description: 'Build verified proof of your work with OnlyWorks — a desktop app that turns your real work sessions into AI-written reports of your skills and accomplishments, shared as one link instead of a resume. Free for job seekers; built for students and professionals building a portfolio.',
  keywords: [
    'AI platform',
    'work verification',
    'work portfolio',
    'authentic work proof',
    'verified reports',
    'professional specialists',
    'AI analysis',
    'work authentication',
    'productivity verification',
    'verified work reports',
    'career portfolio',
    'OnlyWorks',
    'student experience',
    'job seeker portfolio'
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.only-works.com',
    siteName: 'OnlyWorks',
    title: 'OnlyWorks | AI-Powered Work Verification Platform',
    description: 'Build verified proof of your work with OnlyWorks — a desktop app that turns your real work sessions into AI-written reports of your skills and accomplishments, shared as one link instead of a resume. Free for job seekers; built for students and professionals building a portfolio.',
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
    description: 'Build verified proof of your work with OnlyWorks — a desktop app that turns your real work sessions into AI-written reports of your skills and accomplishments, shared as one link instead of a resume. Free for job seekers; built for students and professionals building a portfolio.',
    images: ['/images/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://www.only-works.com',
  },
  other: {
    'msapplication-TileColor': '#5c5ce6',
    'theme-color': '#5c5ce6',
    'color-scheme': 'light',
    'rating': 'general',
    'revisit-after': '7 days',
    'google-site-verification': 'nswKY7kAbZl8O4tAwnMpAc0Wwfb7CnmMeZX7lVJtliE',
    // Performance hints
    'dns-prefetch': 'https://fonts.googleapis.com',
    'preconnect': 'https://fonts.gstatic.com',
    // LinkedIn meta tags
    'linkedin:title': 'OnlyWorks | AI-Powered Work Verification Platform',
    'linkedin:description': 'Build verified proof of your work with OnlyWorks — a desktop app that turns your real work sessions into AI-written reports of your skills and accomplishments, shared as one link instead of a resume. Free for job seekers; built for students and professionals building a portfolio.',
    'linkedin:image': '/images/linkedin-image.png',
    'linkedin:url': 'https://www.only-works.com',
    // YouTube meta tags
    'youtube:title': 'OnlyWorks | AI-Powered Work Verification Platform',
    'youtube:description': 'Build verified proof of your work with OnlyWorks — a desktop app that turns your real work sessions into AI-written reports of your skills and accomplishments, shared as one link instead of a resume. Free for job seekers; built for students and professionals building a portfolio.',
    'youtube:image': '/images/youtube-image.png',
    'youtube:url': 'https://www.only-works.com',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
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
    <html lang="en" className={`${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Favicon - all sizes explicitly defined for search engines */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />


        {/* Performance - Font preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
                "url": "https://www.only-works.com/favicon.svg",
                "width": 90,
                "height": 108,
                "caption": "OnlyWorks Logo"
              },
              "description": "Build verified proof of your work with OnlyWorks — a desktop app that turns your real work sessions into AI-written reports of your skills and accomplishments, shared as one link instead of a resume. Free for job seekers; built for students and professionals building a portfolio.",
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
              "description": "Build verified proof of your work with OnlyWorks — a desktop app that turns your real work sessions into AI-written reports of your skills and accomplishments, shared as one link instead of a resume. Free for job seekers; built for students and professionals building a portfolio.",
              "url": "https://www.only-works.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "macOS, Windows",
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
              "keywords": "AI platform, work verification, work portfolio, authentic work proof, verified reports, student portfolio, job seeker proof",
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

        {/* FAQ Schema - AI Search Optimization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is OnlyWorks?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "OnlyWorks is a desktop app that turns your real work sessions into AI-written, verified reports of your skills and accomplishments. You run a session while you work, OnlyWorks generates the report, and you share it as one OW Profile link instead of a resume. It's a way for students and early-career professionals to stand out with credible proof of what they actually did."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is OnlyWorks good for students and early career professionals?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! OnlyWorks is specifically designed to help students and early career professionals stand out in competitive job markets. Our platform allows you to build verifiable proof of your work, skills, and projects, making you more attractive to employers. Many students use OnlyWorks as the best way to demonstrate their capabilities and gain valuable experience."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does OnlyWorks help job seekers stand out?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "OnlyWorks helps job seekers stand out by turning real work sessions into verified reports. Instead of just listing projects on your resume, you can share reports built from what you actually did — corroborated by AI against your real work, not self-reported. This is especially valuable for students and early career professionals looking to differentiate themselves from other candidates."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the career opportunities at OnlyWorks?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "OnlyWorks offers exciting career opportunities for students, interns, and experienced professionals. We're looking for talented individuals in marketing, engineering, product, and more. We provide a great environment for early career professionals to gain real-world experience and grow their skills. Visit our careers page to see open positions including internships and full-time roles."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much does OnlyWorks cost?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "OnlyWorks is free to get started. Generate reports, build your OW Profile, and share verified proof of your work at no cost."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What happens to my personal data on OnlyWorks?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sessions only run when you start and stop them. To generate your report, your work data is processed by OnlyWorks and its AI provider; it is encrypted in transit and at rest, and never sold. You choose what goes on your profile and who can see it. See our Privacy Policy for what is collected, who processes it, and how to request deletion."
                  }
                }
              ]
            })
          }}
        />

        {/* HowTo Schema - Getting Started Guide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "How to Get Started with OnlyWorks",
              "description": "Learn how to start using OnlyWorks to verify your work and stand out as a professional or student.",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Sign Up",
                  "text": "Create your free OnlyWorks account to start building verifiable proof of your work and productivity.",
                  "position": 1
                },
                {
                  "@type": "HowToStep",
                  "name": "Build Your Portfolio",
                  "text": "Start a session and do your normal work. You start and stop each session, and OnlyWorks builds verified proof from what you actually did.",
                  "position": 2
                },
                {
                  "@type": "HowToStep",
                  "name": "Generate Reports",
                  "text": "Generate verified reports built from your real work sessions. Share them with employers, clients, or add them to your portfolio as one link.",
                  "position": 3
                }
              ]
            })
          }}
        />

      </head>
      <body className="antialiased">
        <a href="#main" className="skip-to-content">Skip to content</a>
        <ClientLayout>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "'Instrument Sans', system-ui, sans-serif",
                background: '#080503',
                color: '#fafaf9',
                border: '1px solid #44423d'
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

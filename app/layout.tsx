import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ClientLayout from '@/components/ClientLayout'
import { PostHogProvider } from '@/components/PostHogProvider'
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
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-to-content">Skip to content</a>
        <PostHogProvider>
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
        </PostHogProvider>
      </body>
    </html>
  )
}

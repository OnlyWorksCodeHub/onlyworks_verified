import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL('https://onlyworks.com'),
  title: 'OnlyWorks - Productivity Verification Platform',
  description: 'Prove your work is real, efficient, and authentic with AI-powered verification',
  keywords: ['productivity', 'verification', 'AI', 'work tracking', 'authentication', 'efficiency'],
  authors: [{ name: 'OnlyWorks' }],
  creator: 'OnlyWorks',
  publisher: 'OnlyWorks',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onlyworks.com',
    siteName: 'OnlyWorks',
    title: 'OnlyWorks - Productivity Verification Platform',
    description: 'Prove your work is real, efficient, and authentic with AI-powered verification',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnlyWorks - Productivity Verification Platform',
    description: 'Prove your work is real, efficient, and authentic with AI-powered verification',
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
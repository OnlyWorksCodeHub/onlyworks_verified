import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'OnlyWorks - Productivity Verification Platform',
  description: 'Prove your work is real, efficient, and authentic with AI-powered verification',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'OnlyWorks - Productivity Verification Platform',
    description: 'Prove your work is real, efficient, and authentic with AI-powered verification',
    images: ['/favicon.png'], // You should create a proper og-image.png (1200x630px) for better social sharing
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-dark-bg text-white antialiased`}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'dark:bg-dark-card dark:text-white',
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
}

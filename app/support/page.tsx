import type { Metadata } from 'next'
import SupportClient from './SupportClient'

export const metadata: Metadata = {
  title: 'OnlyWorks Help Center | Setup, Permissions & Troubleshooting',
  description: 'Install OnlyWorks, grant Screen Recording and Accessibility permissions, run sessions, generate reports, cancel billing, and fix common issues.',
  alternates: {
    canonical: 'https://www.only-works.com/support',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do I completely uninstall the app?', acceptedAnswer: { '@type': 'Answer', text: 'Download our uninstaller to completely remove OnlyWorks and all its data. Uninstallers are available for both Mac and Windows.' } },
    { '@type': 'Question', name: 'The app is not starting. What should I do?', acceptedAnswer: { '@type': 'Answer', text: 'Make sure the app is in your Applications folder, right-click the app and select "Open" to bypass Gatekeeper, check System Settings → Privacy & Security for blocked app warnings, or try uninstalling and reinstalling.' } },
    { '@type': 'Question', name: 'Permissions are not working. How do I fix this?', acceptedAnswer: { '@type': 'Answer', text: 'Go to System Settings → Privacy & Security → Screen Recording, toggle OnlyWorks OFF then ON, do the same for Accessibility, and restart the app. Add OnlyWorks to "Screen & System Audio Recording", not "System Audio Recording Only".' } },
    { '@type': 'Question', name: 'How does the app update?', acceptedAnswer: { '@type': 'Answer', text: 'OnlyWorks checks for updates automatically on launch. Updates download in the background and prompt you to restart.' } },
    { '@type': 'Question', name: 'Is my data private and secure?', acceptedAnswer: { '@type': 'Answer', text: 'Capture only runs during the sessions you start and stop — nothing happens when there is no session. You can delete your account and data anytime. See the Privacy and Security pages for exactly what is collected and where it goes.' } },
    { '@type': 'Question', name: 'What macOS version do I need?', acceptedAnswer: { '@type': 'Answer', text: 'macOS 10.15 (Catalina) or later. Both Apple Silicon (M1, M2, M3, M4) and Intel Macs are supported.' } },
    { '@type': 'Question', name: 'How do I cancel my subscription?', acceptedAnswer: { '@type': 'Answer', text: 'Go to your Account page or email support@only-works.com.' } },
  ],
}

export default function SupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SupportClient />
    </>
  )
}
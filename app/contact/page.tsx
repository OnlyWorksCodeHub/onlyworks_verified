import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact OnlyWorks | Support, Partnerships & Press',
  description: 'Contact OnlyWorks for product questions, partnerships, press, or support. Typical response within 24 hours.',
  alternates: {
    canonical: 'https://www.only-works.com/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
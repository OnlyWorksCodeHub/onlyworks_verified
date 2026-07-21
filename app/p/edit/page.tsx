import type { Metadata } from 'next'
import ProfileEditClient from './ProfileEditClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function ProfileEditPage() {
  return <ProfileEditClient />
}
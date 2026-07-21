import type { Metadata } from 'next'
import ProjectsClient from './ProjectsClient'

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function ProjectsPage() {
  return <ProjectsClient />
}
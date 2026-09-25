import JobDetailClient from './JobDetailClient'

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailClient jobId={params.id} />
}

import type { Metadata } from 'next'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search Candidates by Verified Skills | OnlyWorks',
  description: "Search OnlyWorks profiles by skill, field, and level. Skills marked verified were corroborated against the candidate's own real work - not self-reported.",
  alternates: {
    canonical: 'https://www.only-works.com/search',
  },
}

export default function SearchPage() {
  return <SearchClient />
}
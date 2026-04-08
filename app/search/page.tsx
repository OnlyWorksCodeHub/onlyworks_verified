'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Search, Filter, Shield, ChevronDown, ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/components/AuthProvider'
import { NEXT_PUBLIC_BACKEND_URL } from '@/lib/config'
import Link from 'next/link'

interface CandidateSkill {
  skill: string
  proficiency: string
  verified: boolean
}

interface CandidateTeaser {
  candidate_id?: string
  ow_id?: string
  full_name?: string
  company?: string
  job_title?: string
  avatar_url?: string
  field_of_work: string
  experience_level: string
  top_skills: CandidateSkill[]
  total_verified_skills: number
  total_skills: number
  match_score: number
  matched_count: number
}

const FIELDS = [
  { value: '', label: 'All fields' },
  { value: 'software-development', label: 'Software Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'product-management', label: 'Product Management' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'finance', label: 'Finance' },
]

const LEVELS = [
  { value: '', label: 'All levels' },
  { value: 'entry', label: 'Entry' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { backendToken } = useAuth()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [field, setField] = useState(searchParams.get('field') || '')
  const [level, setLevel] = useState(searchParams.get('level') || '')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [results, setResults] = useState<CandidateTeaser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const isAuthenticated = !!backendToken

  const doSearch = useCallback(async (searchQuery: string, searchPage = 1) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams({ q: searchQuery.trim(), page: String(searchPage) })
      if (field) params.set('field', field)
      if (level) params.set('level', level)
      if (verifiedOnly) params.set('verified', 'true')

      const headers: Record<string, string> = {}
      if (backendToken) {
        headers['Authorization'] = `Bearer ${backendToken}`
      }

      const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/search?${params}`, { headers })
      const data = await res.json()

      if (data.success) {
        setResults(data.data.candidates || [])
        setTotal(data.data.total || 0)
        setPage(searchPage)
      }
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }, [field, level, verifiedOnly, backendToken])

  // Auto-search on mount if query param exists
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      doSearch(q)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}${field ? `&field=${field}` : ''}${level ? `&level=${level}` : ''}`, { scroll: false })
    doSearch(query)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-28 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Search Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-display tracking-tight mb-3">Find verified talent</h1>
            <p className="text-muted-foreground text-lg">Search candidates by skills proven through real work, not just listed on a resume.</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search skills — e.g. React, Python, Project Management"
                  className="w-full h-14 pl-12 pr-4 text-base rounded-full border border-foreground/15 bg-background focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 focus:border-[#8b5cf6] transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-14 px-8 rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#8b5cf6' }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="h-14 w-14 rounded-full border border-foreground/15 flex items-center justify-center hover:bg-foreground/5 transition-all"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-4 mt-4 p-4 border border-foreground/10 rounded-2xl">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Field</label>
                      <select value={field} onChange={(e) => setField(e.target.value)} className="h-10 px-3 rounded-lg border border-foreground/15 bg-background text-sm">
                        {FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Level</label>
                      <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-10 px-3 rounded-lg border border-foreground/15 bg-background text-sm">
                        {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 justify-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="rounded" />
                        <span className="text-sm">Verified skills only</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Results */}
          {searched && (
            <div>
              <p className="text-sm text-muted-foreground mb-6">
                {loading ? 'Searching...' : `${total} candidate${total !== 1 ? 's' : ''} found`}
              </p>

              {results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((candidate, i) => (
                    <CandidateCard key={candidate.ow_id || candidate.candidate_id || i} candidate={candidate} authenticated={isAuthenticated} />
                  ))}
                </div>
              ) : !loading ? (
                <div className="text-center py-20">
                  <p className="text-xl font-medium mb-2">No candidates found</p>
                  <p className="text-muted-foreground">Try different skills or broaden your filters.</p>
                </div>
              ) : null}

              {/* Pagination */}
              {total > 20 && (
                <div className="flex justify-center gap-3 mt-8">
                  {page > 1 && (
                    <button onClick={() => doSearch(query, page - 1)} className="px-4 py-2 rounded-full border border-foreground/15 text-sm hover:bg-foreground/5">
                      Previous
                    </button>
                  )}
                  <span className="px-4 py-2 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 20)}</span>
                  {page * 20 < total && (
                    <button onClick={() => doSearch(query, page + 1)} className="px-4 py-2 rounded-full border border-foreground/15 text-sm hover:bg-foreground/5">
                      Next
                    </button>
                  )}
                </div>
              )}

              {/* Sign up CTA for anonymous users */}
              {!isAuthenticated && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 p-8 rounded-2xl border border-[#8b5cf6]/20 bg-[#8b5cf6]/5 text-center"
                >
                  <h3 className="text-xl font-medium mb-2">Sign up free to see who they are</h3>
                  <p className="text-muted-foreground mb-6">Create a free hiring manager account to view full profiles, names, and work history.</p>
                  <Link
                    href="/hiring"
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-full font-medium text-white hover:opacity-90 transition-all"
                    style={{ background: '#8b5cf6' }}
                  >
                    Get started free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>
          )}

          {/* Empty state before search */}
          {!searched && (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xl font-medium mb-2">Search for verified talent</p>
              <p className="text-muted-foreground max-w-md mx-auto">Enter skills above to find candidates with work-verified abilities. Every skill is backed by real project data, not self-reported claims.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function CandidateCard({ candidate, authenticated }: { candidate: CandidateTeaser; authenticated: boolean }) {
  const proficiencyColor: Record<string, string> = {
    advanced: '#22c55e',
    intermediate: '#8b5cf6',
    emerging: '#f59e0b',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-foreground/10 hover:border-foreground/20 transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Identity or anonymous */}
          <div className="flex items-center gap-3 mb-3">
            {authenticated && candidate.avatar_url ? (
              <div className="w-10 h-10 rounded-full bg-foreground/10 overflow-hidden flex-shrink-0">
                <img src={candidate.avatar_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-muted-foreground">?</span>
              </div>
            )}
            <div>
              <h3 className="font-medium text-base">
                {authenticated && candidate.full_name ? candidate.full_name : 'Candidate'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {authenticated && candidate.job_title ? `${candidate.job_title}${candidate.company ? ` at ${candidate.company}` : ''}` : (
                  <>{candidate.field_of_work?.replace(/-/g, ' ')} &middot; {candidate.experience_level}</>
                )}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {candidate.top_skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border"
                style={{ borderColor: `${proficiencyColor[skill.proficiency] || '#8b5cf6'}33` }}
              >
                {skill.verified && <Shield className="w-3.5 h-3.5" style={{ color: proficiencyColor[skill.proficiency] }} />}
                {skill.skill}
              </span>
            ))}
          </div>
        </div>

        {/* Match score + action */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="text-right">
            <span className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{candidate.match_score}%</span>
            <span className="block text-xs text-muted-foreground">match</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {candidate.total_verified_skills} verified skill{candidate.total_verified_skills !== 1 ? 's' : ''}
          </div>
          {authenticated && candidate.ow_id && (
            <Link
              href={`/p/${candidate.ow_id}`}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-foreground/15 hover:bg-foreground/5 transition-all opacity-0 group-hover:opacity-100"
            >
              View profile
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

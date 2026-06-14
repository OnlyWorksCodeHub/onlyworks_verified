'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import OWProfileView from './OWProfileView'
import ResumeView from './ResumeView'
import type { OWProfileData, ResumeData } from '@/lib/types/profile'

interface Props {
  owProfile: OWProfileData
  resume: ResumeData
}

export default function ProfileViewToggle({ owProfile, resume }: Props) {
  const searchParams = useSearchParams()
  const defaultView = searchParams.get('view') === 'resume' ? 'resume' : 'ow-profile'
  const [view, setView] = useState<'ow-profile' | 'resume'>(defaultView)

  return (
    <>
      <div style={{
        display: 'flex',
        background: 'var(--bg-alt)',
        border: '1px solid var(--border)',
        borderRadius: '999px',
        padding: '3px',
        marginBottom: '1rem',
        width: 'fit-content',
      }}>
        <button
          onClick={() => setView('ow-profile')}
          style={{
            padding: '6px 20px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: view === 'ow-profile' ? '#fff' : 'var(--text-muted)',
            background: view === 'ow-profile' ? 'var(--accent)' : 'transparent',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          OW Profile
        </button>
        <button
          onClick={() => setView('resume')}
          style={{
            padding: '6px 20px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: view === 'resume' ? '#fff' : 'var(--text-muted)',
            background: view === 'resume' ? 'var(--accent)' : 'transparent',
            border: 'none',
            borderRadius: '999px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Resume
        </button>
      </div>

      {view === 'ow-profile' ? (
        <OWProfileView owProfile={owProfile} />
      ) : (
        <ResumeView resume={resume} skills={owProfile.skills} strengths={owProfile.top_strengths} />
      )}
    </>
  )
}

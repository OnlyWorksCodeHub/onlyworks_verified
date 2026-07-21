'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react'

function VerifyTalentInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'verifying' | 'error' | 'redirecting'>('verifying')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('This link is missing a token. Please use the link from your email.')
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/talent-community/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        if (cancelled) return
        if (!res.ok || !data.success) {
          setStatus('error')
          setErrorMessage(data.error || 'This link is invalid or has expired.')
          return
        }
        // Stash session token + owId in localStorage for now (simple v1).
        // A full session-cookie integration with AuthProvider can come in a follow-up.
        const tcToken = data.data?.token
        const owId = data.data?.user?.owId
        if (tcToken) localStorage.setItem('talent_community_token', tcToken)
        if (owId) localStorage.setItem('talent_community_ow_id', owId)

        setStatus('redirecting')
        router.replace(`/talent/welcome?owId=${encodeURIComponent(owId || '')}`)
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        setErrorMessage('Network error. Please try again.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-display tracking-tight mb-3">Confirming your spot…</h1>
            <p className="text-base text-muted-foreground">Just a moment.</p>
          </>
        )}
        {status === 'redirecting' && (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-display tracking-tight mb-3">You're in.</h1>
            <p className="text-base text-muted-foreground">Taking you to your profile…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-destructive/30">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h1 className="text-3xl font-display tracking-tight mb-3">Link no longer valid</h1>
            <p className="text-base text-muted-foreground mb-8">{errorMessage}</p>
            <Link
              href="/talent"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-medium rounded-full text-white hover:opacity-90 transition-all"
              style={{ background: '#8b5cf6' }}
            >
              Request a new link
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyTalentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    }>
      <VerifyTalentInner />
    </Suspense>
  )
}

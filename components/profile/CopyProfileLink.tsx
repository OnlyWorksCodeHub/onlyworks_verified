'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface Props {
  url: string
}

export default function CopyProfileLink({ url }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can fail in older browsers / insecure contexts — stay quiet.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.12em] font-semibold transition-colors"
      style={{ color: copied ? 'var(--accent)' : 'var(--text-muted)' }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  )
}

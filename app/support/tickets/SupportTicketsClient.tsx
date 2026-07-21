'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  LifeBuoy, Paperclip, UploadCloud, X, CheckCircle, ArrowRight, ArrowLeft,
  Image as ImageIcon, Film, Loader2, AlertCircle, ShieldCheck, Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { GridBackground, PulsingRings } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { BinaryRain, WatermarkText, ConnectionLines, CodeDecoration } from '@/components/ui/decorative-fills'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import {
  SUPPORT_BUCKET,
  TICKET_CATEGORIES,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  MAX_TOTAL_BYTES,
  isAllowedAttachmentType,
  formatBytes,
} from '@/lib/support/tickets'

type UploadStatus = 'uploading' | 'done' | 'error'
interface UploadItem {
  id: string
  file: File
  status: UploadStatus
  path?: string
  previewUrl?: string
  error?: string
}

const inputClass =
  'w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30'

export default function SupportTicketsPage() {
  const { user, owId } = useAuth()
  const prefilled = useRef(false)
  // Created lazily on first upload (browser only) so static prerender never
  // instantiates a Supabase client without the public env vars.
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const getSupabase = () => (supabaseRef.current ??= createClient())

  const [form, setForm] = useState({ name: '', email: '', category: 'bug', subject: '', message: '' })
  const [items, setItems] = useState<UploadItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Mirror of `items` so cleanup and recompute can read the latest value without
  // re-subscribing effects or running side effects inside a state updater.
  const itemsRef = useRef<UploadItem[]>([])
  useEffect(() => { itemsRef.current = items }, [items])

  // Prefill name/email once from the signed-in account (the form still works logged out).
  useEffect(() => {
    if (prefilled.current || !user) return
    const meta = (user.user_metadata || {}) as Record<string, unknown>
    const fullName = (meta.full_name || meta.name || '') as string
    setForm((f) => ({
      ...f,
      email: f.email || user.email || '',
      name: f.name || fullName || '',
    }))
    prefilled.current = true
  }, [user])

  // Revoke any outstanding object URLs on unmount (reads the latest items via ref).
  useEffect(() => {
    return () => { itemsRef.current.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl)) }
  }, [])

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function uploadOne(item: UploadItem) {
    try {
      const res = await fetch('/api/support-tickets/attachment-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.file.name, type: item.file.type, size: item.file.size }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload could not be prepared')

      const { error } = await getSupabase().storage
        .from(SUPPORT_BUCKET)
        .uploadToSignedUrl(data.path, data.token, item.file)
      if (error) throw new Error(error.message || 'Upload failed')

      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'done', path: data.path } : i)))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'error', error: msg } : i)))
      toast.error(`${item.file.name}: ${msg}`)
    }
  }

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList)
    if (!incoming.length) return

    // Compute everything OUTSIDE the state updater (which must stay pure — React
    // double-invokes updaters under StrictMode, which would otherwise create
    // duplicate ids/uploads and double toasts). Read current state from the ref.
    const current = itemsRef.current
    const accepted: UploadItem[] = []
    const errors: string[] = []
    let count = current.length
    let totalBytes = current.reduce((sum, i) => sum + i.file.size, 0)

    for (const file of incoming) {
      if (count >= MAX_ATTACHMENTS) {
        errors.push(`Up to ${MAX_ATTACHMENTS} files.`)
        break
      }
      if (!isAllowedAttachmentType(file.type)) {
        errors.push(`${file.name}: only images and videos can be attached.`)
        continue
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        errors.push(`${file.name} is over ${Math.round(MAX_ATTACHMENT_BYTES / 1024 / 1024)} MB.`)
        continue
      }
      if (totalBytes + file.size > MAX_TOTAL_BYTES) {
        errors.push(`${file.name} would exceed the total attachment limit.`)
        continue
      }
      count += 1
      totalBytes += file.size
      accepted.push({
        id: crypto.randomUUID(),
        file,
        status: 'uploading',
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      })
    }

    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted])
      accepted.forEach((item) => queueMicrotask(() => uploadOne(item)))
    }
    errors.forEach((msg) => toast.error(msg))
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  const uploading = items.some((i) => i.status === 'uploading')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return
    if (!form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error('Email, subject, and a description are required.')
      return
    }
    if (uploading) {
      toast.error('Hang on — a file is still uploading.')
      return
    }

    const attachments = items
      .filter((i) => i.status === 'done' && i.path)
      .map((i) => ({ path: i.path!, name: i.file.name, type: i.file.type, size: i.file.size }))

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ow_id: owId || undefined, attachments }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not submit your ticket')
      setSubmittedRef(data.ref)
      toast.success("Ticket received — we're on it.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 lg:pt-28 pb-10 lg:pb-14 overflow-hidden border-b border-foreground/10">
        <GridBackground />
        <BinaryRain />
        <CodeDecoration side="right" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Support tickets
            </span>
            <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-display leading-[0.95] tracking-tight mb-4 max-w-3xl">
              Something broke?<br />Show us, don&apos;t just tell us.
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Open a ticket and attach a screenshot or a screen recording of what went wrong. A real person reads every one and replies by email — we aim for 24&ndash;48 hours — and we&apos;ll get your proof running again.
            </p>
            <Link href="/support" className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-foreground hover:underline underline-offset-4">
              <ArrowLeft className="w-4 h-4" /> Back to the help center
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ FORM ═══ */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <PulsingRings className="left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
        <ConnectionLines className="opacity-30" />
        <WatermarkText text="HELP" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          {submittedRef ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto border border-foreground/10 p-8 lg:p-12 text-center"
            >
              <div className="w-14 h-14 flex items-center justify-center border border-foreground/10 mx-auto mb-5">
                <CheckCircle className="w-7 h-7 text-[#8b5cf6]" />
              </div>
              <h2 className="text-3xl font-display mb-2">Ticket received.</h2>
              <p className="text-muted-foreground mb-6">
                Save your reference below. A real person will email a reply to <span className="text-foreground font-medium">{form.email}</span> — we aim for 24&ndash;48 hours.
              </p>
              <div className="inline-block px-5 py-3 border border-foreground/15 font-mono text-lg tracking-wider mb-8">
                {submittedRef}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-medium text-white hover:opacity-90 transition-all"
                  style={{ background: '#8b5cf6' }}
                >
                  Back to help center <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => {
                    items.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl))
                    setItems([])
                    setForm((f) => ({ ...f, category: 'bug', subject: '', message: '' }))
                    setSubmittedRef(null)
                  }}
                  className="inline-flex items-center justify-center h-12 px-6 rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                >
                  Submit another
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
              {/* Left — what to expect */}
              <div>
                <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-5">
                  <span className="w-8 h-px bg-foreground/30" />
                  What happens next
                </span>
                <h2 className="text-3xl lg:text-5xl font-display tracking-tight mb-6">
                  Tell us once.<br />We&apos;ll chase it down.
                </h2>
                <ul className="space-y-5">
                  {[
                    { icon: Paperclip, title: 'Attach the evidence', desc: 'Drop in screenshots or a short screen recording. Seeing the bug is how we fix it fast.' },
                    { icon: ShieldCheck, title: 'A real person reads it', desc: 'No bot loops. Your ticket lands in front of the team that builds the app.' },
                    { icon: Clock, title: 'A reference now, a reply by email', desc: "You'll get a reference code on screen right away, and a real person will email you back — we aim for 24–48 hours." },
                  ].map((b, i) => (
                    <li key={i} className="flex gap-4">
                      <b.icon className="w-6 h-6 shrink-0 mt-0.5 text-[#8b5cf6]" strokeWidth={1.75} />
                      <div>
                        <h3 className="text-base font-medium mb-1">{b.title}</h3>
                        <p className="text-sm text-muted-foreground leading-snug">{b.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — the form */}
              <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onSubmit={handleSubmit}
                className="border border-foreground/10 p-6 sm:p-8 lg:p-10 space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="st-name" className="block text-xs font-mono text-muted-foreground mb-2">Your name</label>
                    <input id="st-name" type="text" value={form.name} onChange={setField('name')} placeholder="Jane Doe" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="st-email" className="block text-xs font-mono text-muted-foreground mb-2">Email *</label>
                    <input id="st-email" type="email" required aria-required="true" value={form.email} onChange={setField('email')} placeholder="jane@acme.com" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="st-category" className="block text-xs font-mono text-muted-foreground mb-2">What&apos;s this about?</label>
                  <select id="st-category" value={form.category} onChange={setField('category')} className={inputClass}>
                    {TICKET_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="st-subject" className="block text-xs font-mono text-muted-foreground mb-2">Subject *</label>
                  <input id="st-subject" type="text" required aria-required="true" value={form.subject} onChange={setField('subject')} placeholder="App won't start after the latest update" className={inputClass} />
                </div>

                <div>
                  <label htmlFor="st-message" className="block text-xs font-mono text-muted-foreground mb-2">What happened? *</label>
                  <textarea id="st-message" required aria-required="true" value={form.message} onChange={setField('message')} rows={5} placeholder="Walk us through it — what you did, what you expected, and what actually happened." className={`${inputClass} resize-y min-h-[120px]`} />
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-2">Screenshots or screen recordings</label>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Add screenshots or screen recordings"
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                    onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); addFiles(e.dataTransfer.files) }}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
                    className={`flex flex-col items-center justify-center gap-2 px-6 py-8 border border-dashed cursor-pointer transition-colors outline-none focus-visible:border-[#8b5cf6] focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/30 ${dragActive ? 'border-[#8b5cf6] bg-[#8b5cf6]/[0.04]' : 'border-foreground/20 hover:border-foreground/40'}`}
                  >
                    <UploadCloud className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
                    <p className="text-sm text-center">
                      <span className="font-medium text-foreground">Drag files here</span>
                      <span className="text-muted-foreground"> or click to browse</span>
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      Images &amp; video · up to {MAX_ATTACHMENTS} files · {Math.round(MAX_ATTACHMENT_BYTES / 1024 / 1024)} MB each
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => { addFiles(e.target.files || []); e.target.value = '' }}
                    />
                  </div>

                  {items.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 px-3 py-2 border border-foreground/10">
                          <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
                            {item.previewUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                            ) : item.file.type.startsWith('video/') ? (
                              <Film className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate">{item.file.name}</p>
                            <p className="text-xs font-mono text-muted-foreground">{formatBytes(item.file.size)}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {item.status === 'uploading' && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                            {item.status === 'done' && <CheckCircle className="w-4 h-4 text-[#8b5cf6]" />}
                            {item.status === 'error' && (
                              <span title={item.error} className="text-muted-foreground"><AlertCircle className="w-4 h-4 text-[#e40014]" /></span>
                            )}
                            <button type="button" onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label={`Remove ${item.file.name}`}>
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <ShimmerButton
                  shimmerColor="#a78bfa"
                  background="rgba(139, 92, 246, 1)"
                  borderRadius="1.75rem"
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="w-full h-14 px-8 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LifeBuoy className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Sending…' : uploading ? 'Waiting for uploads…' : 'Submit ticket'}
                </ShimmerButton>
                <p className="text-center text-xs text-muted-foreground font-mono">
                  Prefer email? <a href="mailto:support@only-works.com" className="underline underline-offset-2 hover:text-foreground">support@only-works.com</a>
                </p>
              </motion.form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * VideoBlock — a swappable, lazy, robust product-video slot.
 *
 * Drop a Higgsfield clip in later by changing `src` (and `poster`). With no
 * `src` it degrades gracefully to the poster image, so the layout never breaks
 * while clips are still being produced.
 *
 * Modes:
 *   - "autoplay": muted, looping, ambient. Plays only when scrolled into view,
 *      and stays paused for users who prefer reduced motion (poster shown).
 *   - "click":    poster + play button. Loads the file only on click (so the
 *      page never downloads a multi-MB clip the visitor didn't ask for), then
 *      plays with sound and native controls.
 *
 * No layout shift: the frame reserves space via aspect-ratio before anything
 * loads. Optional `chrome` renders the same little app-window frame used
 * elsewhere on the site.
 */

type VideoBlockProps = {
  /** mp4/webm URL or /public path. Omit to show the poster only. */
  src?: string
  /** Fallback still shown before/instead of the video. Strongly recommended. */
  poster?: string
  /** Short line under the frame. */
  caption?: string
  /** width / height. Default 16 / 9. */
  aspect?: number
  /** "autoplay" = muted ambient loop; "click" = play button + sound. */
  mode?: 'autoplay' | 'click'
  /** true for a generic window, or a string to label the title bar (e.g. "OnlyWorks"). */
  chrome?: boolean | string
  /** Accessible description of the clip. */
  label?: string
  className?: string
  /** Eager-load the poster (use for above-the-fold). */
  priority?: boolean
  /** Fill the parent (no border, no rounded, no aspect box) — for full-bleed brand bands. */
  fullBleed?: boolean
}

export function VideoBlock({
  src,
  poster,
  caption,
  aspect = 16 / 9,
  mode = 'click',
  chrome = false,
  label,
  className,
  priority = false,
  fullBleed = false,
}: VideoBlockProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [activated, setActivated] = useState(false) // click-mode: user pressed play
  const [reducedMotion, setReducedMotion] = useState(false)

  // Respect the user's reduced-motion setting for ambient autoplay.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  // Only load/play the ambient video once it scrolls near the viewport.
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const isAutoplay = mode === 'autoplay'
  // "ambient" = the muted, looping, no-controls state. Once the user explicitly
  // presses play (click mode, or a reduced-motion visitor opting in) we leave
  // ambient and behave like a normal player: controls + sound.
  const ambient = isAutoplay && !activated
  const showVideo = !!src && (activated || (ambient && inView && !reducedMotion))
  // Show a play affordance whenever there's no ambient playback to rely on:
  // click mode always, and autoplay mode when reduced motion suppresses the loop.
  const showPlayButton = !!src && !activated && (!isAutoplay || reducedMotion)
  const chromeLabel = typeof chrome === 'string' ? chrome : 'OnlyWorks'

  // Drive ambient playback.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !ambient) return
    if (inView && !reducedMotion) {
      v.play().catch(() => {/* autoplay can be blocked; poster stays visible */})
    } else {
      v.pause()
    }
  }, [inView, reducedMotion, ambient])

  // Play immediately when the user opts in (the click is the gesture browsers require).
  useEffect(() => {
    if (!activated) return
    videoRef.current?.play().catch(() => {})
  }, [activated])

  return (
    <figure className={cn('relative w-full', fullBleed && 'h-full', className)} ref={wrapRef}>
      <div
        className={cn(
          'relative w-full overflow-hidden bg-[#1c1b18]',
          fullBleed ? 'h-full' : 'border border-foreground/10',
        )}
        style={fullBleed ? undefined : { aspectRatio: String(aspect) }}
      >
        {chrome && (
          <div
            className="absolute inset-x-0 top-0 z-30 flex items-center gap-1.5 px-4 py-2.5"
            style={{ background: '#292825', borderBottom: '1px solid rgba(250,250,249,0.1)' }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
            <span className="ml-auto text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>
              {chromeLabel}
            </span>
          </div>
        )}

        {/* Poster — always rendered underneath so there is never a blank frame. */}
        {poster && (
          <Image
            src={poster}
            alt={label || caption || 'OnlyWorks preview'}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority={priority}
            className={cn(
              'object-cover object-top transition-opacity duration-500',
              showVideo ? 'opacity-0' : 'opacity-100',
              chrome && 'pt-9',
            )}
          />
        )}

        {/* The clip itself — only mounted once it should actually play/load. */}
        {showVideo && (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className={cn('absolute inset-0 w-full h-full object-cover object-top', chrome && 'pt-9')}
            muted={ambient}
            loop={ambient}
            autoPlay={ambient}
            playsInline
            controls={!ambient}
            preload="metadata"
            aria-hidden={ambient ? true : undefined}
            aria-label={ambient ? undefined : label}
          />
        )}

        {/* Play affordance — click mode, or reduced-motion users opting into the loop. */}
        {showPlayButton && (
          <button
            type="button"
            onClick={() => setActivated(true)}
            className="group absolute inset-0 z-20 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2"
            aria-label={label ? `Play: ${label}` : 'Play video'}
          >
            <span
              className="absolute inset-0 transition-colors"
              style={{ background: 'rgba(8,5,3,0.18)' }}
            />
            <span className="relative flex items-center justify-center w-16 h-16 rounded-full text-white transition-transform group-hover:scale-110"
              style={{ background: '#8b5cf6' }}>
              <Play className="w-6 h-6 translate-x-0.5" fill="currentColor" />
            </span>
          </button>
        )}

        {/* No clip yet — small honest tag so the slot reads as intentional. */}
        {!src && (
          <span className="absolute bottom-3 right-3 z-20 px-2.5 py-1 text-[11px] font-mono rounded-sm"
            style={{ background: 'rgba(8,5,3,0.55)', color: 'rgba(250,250,249,0.75)' }}>
            preview
          </span>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-sm text-foreground/70">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

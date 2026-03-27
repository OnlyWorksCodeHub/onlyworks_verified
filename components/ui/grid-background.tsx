'use client'

import { motion } from 'framer-motion'

/**
 * Animated grid background with floating dots and subtle pulse.
 * Drop into any section with large blank areas.
 */
export function GridBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.04]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h${i}`} className="absolute h-px w-full" style={{ top: `${(i + 1) * 12.5}%`, background: '#080503' }} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`v${i}`} className="absolute w-px h-full" style={{ left: `${(i + 1) * 8.33}%`, background: '#080503' }} />
        ))}
      </div>

      {/* Floating dots at intersections */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`dot${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: '#8b5cf6',
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            opacity: [0.15, 0.4, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Geometric rotating shape — use in hero sections.
 */
export function GeometricPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none select-none ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 500 500"
        className="w-full h-full opacity-[0.06]"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx="250" cy="250" r={40 + i * 20} fill="none" stroke="#080503" strokeWidth="0.5" strokeDasharray="3 8" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`r${i}`}
            x1="250" y1="250"
            x2={250 + 240 * Math.cos((i * 45 * Math.PI) / 180)}
            y2={250 + 240 * Math.sin((i * 45 * Math.PI) / 180)}
            stroke="#080503" strokeWidth="0.3"
          />
        ))}
      </motion.svg>
    </div>
  )
}

/**
 * Floating particles — subtle ambient movement.
 */
export function FloatingParticles({ count = 8, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3) * 2,
            height: 2 + (i % 3) * 2,
            background: i % 2 === 0 ? '#8b5cf6' : '#dad7d0',
            left: `${10 + (i * 11) % 80}%`,
            top: `${5 + (i * 17) % 90}%`,
          }}
          animate={{
            y: [0, -30 - i * 5, 0],
            x: [0, 10 + (i % 3) * 8, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Pulsing concentric rings — use behind stats or hero sections.
 */
export function PulsingRings({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.circle
            key={i}
            cx="200" cy="200" r={50 + i * 35}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="0.5"
            initial={{ opacity: 0.03, scale: 0.95 }}
            animate={{ opacity: [0.03, 0.08, 0.03], scale: [0.95, 1.02, 0.95] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
          />
        ))}
      </svg>
    </div>
  )
}

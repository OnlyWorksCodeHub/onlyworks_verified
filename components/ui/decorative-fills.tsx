'use client'

import { motion } from 'framer-motion'

/* Animated gradient blob — large, colorful, moves slowly */
export function GradientBlob({ className = '', color = 'purple' }: { className?: string; color?: 'purple' | 'blue' | 'warm' }) {
  const colors = {
    purple: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)',
    blue: 'radial-gradient(circle, rgba(99,68,245,0.10) 0%, rgba(24,204,252,0.04) 40%, transparent 70%)',
    warm: 'radial-gradient(circle, rgba(231,228,221,0.4) 0%, rgba(218,215,208,0.15) 40%, transparent 70%)',
  }
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <motion.div
        className="w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] rounded-full blur-3xl"
        style={{ background: colors[color] }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

/* Animated concentric rings that pulse outward */
export function RippleRings({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: 'rgba(139,92,246,0.08)' }}
          animate={{
            scale: [0.3 + i * 0.2, 1.5 + i * 0.3],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 1,
          }}
        />
      ))}
    </div>
  )
}

/* Large faded watermark text — more visible */
export function WatermarkText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center ${className}`} aria-hidden="true">
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="font-display text-[clamp(10rem,25vw,22rem)] leading-none select-none whitespace-nowrap"
        style={{ color: 'rgba(8, 5, 3, 0.03)' }}
      >
        {text}
      </motion.span>
    </div>
  )
}

/* Animated connection lines — nodes with connecting paths */
export function ConnectionLines({ className = '' }: { className?: string }) {
  const nodes = [
    { x: 10, y: 20 }, { x: 30, y: 60 }, { x: 50, y: 30 },
    { x: 70, y: 70 }, { x: 90, y: 40 }, { x: 20, y: 80 },
    { x: 60, y: 85 }, { x: 80, y: 15 },
  ]
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((node, i) => (
          nodes.slice(i + 1).filter((_, j) => j < 2).map((target, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={node.x} y1={node.y}
              x2={target.x} y2={target.y}
              stroke="rgba(139, 92, 246, 0.06)"
              strokeWidth="0.15"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: i * 0.2 }}
            />
          ))
        ))}
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x} cy={node.y} r="0.5"
            fill="rgba(139, 92, 246, 0.1)"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <animate attributeName="r" values="0.3;0.6;0.3" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </motion.circle>
        ))}
      </svg>
    </div>
  )
}

/* Floating abstract shapes — circles, diamonds, squares that drift */
export function FloatingShapes({ className = '' }: { className?: string }) {
  const shapes = [
    { type: 'circle', size: 60, x: '15%', y: '20%', delay: 0 },
    { type: 'diamond', size: 40, x: '75%', y: '30%', delay: 1.5 },
    { type: 'circle', size: 80, x: '85%', y: '70%', delay: 3 },
    { type: 'square', size: 35, x: '25%', y: '75%', delay: 0.8 },
    { type: 'circle', size: 50, x: '55%', y: '15%', delay: 2 },
    { type: 'diamond', size: 45, x: '40%', y: '85%', delay: 4 },
    { type: 'square', size: 55, x: '65%', y: '50%', delay: 1 },
    { type: 'circle', size: 35, x: '10%', y: '55%', delay: 2.5 },
  ]
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            border: '1px solid rgba(139,92,246,0.08)',
            borderRadius: s.type === 'circle' ? '50%' : s.type === 'diamond' ? '4px' : '0',
            transform: s.type === 'diamond' ? 'rotate(45deg)' : undefined,
            background: i % 3 === 0 ? 'rgba(139,92,246,0.03)' : 'transparent',
          }}
          animate={{
            y: [0, -15, 10, 0],
            x: [0, 8, -8, 0],
            rotate: s.type === 'diamond' ? [45, 55, 45] : [0, 5, -3, 0],
            scale: [1, 1.05, 0.97, 1],
          }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  )
}

/* Scan line animation overlay */
export function ScanLines({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

/* Animated diagonal stripes that shimmer */
export function ShimmerStripes({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            rgba(139,92,246,0.03) 40px,
            rgba(139,92,246,0.03) 42px
          )`,
          backgroundSize: '200% 200%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

/* Keeping old exports as aliases for backwards compat */
export const BinaryRain = FloatingShapes
export const CodeDecoration = ({ className = '', side = 'right' }: { className?: string; side?: string }) => (
  <GradientBlob
    className={`${side === 'right' ? '-right-40 top-1/4' : '-left-40 top-1/4'} ${className}`}
    color="purple"
  />
)
export const ASCIIBlock = ({ className = '' }: { className?: string; variant?: string }) => (
  <RippleRings className={`w-[300px] h-[300px] ${className}`} />
)

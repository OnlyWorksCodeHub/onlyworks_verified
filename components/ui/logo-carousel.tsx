'use client'

import { useEffect, useRef } from 'react'

const logos = [
  { name: 'Perplexity', src: 'https://framerusercontent.com/images/H2uMsivchZzjvRhz3xCe7yheV0.png?scale-down-to=512', width: 133, height: 32 },
  { name: 'Cursor', src: 'https://framerusercontent.com/images/k9s5vZXPE3VedLHG3a2tdOHjXqg.png?scale-down-to=1024', width: 127, height: 32 },
  { name: 'Monte Carlo', src: 'https://framerusercontent.com/images/p1HJ3s3sG81YrDBopNCzCulPwk.png?scale-down-to=512', width: 98, height: 32 },
  { name: 'JuiceBox', src: 'https://framerusercontent.com/images/9XDPJRrhKtLTjS9HKCRFtXeDs1E.svg', width: 113, height: 26 },
  { name: 'KPMG', src: 'https://www.datocms-assets.com/157377/1743003306-kpmg.png', width: 158, height: 61 },

]

export function LogoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return
    
    let animationId: number
    let scrollAmount = 0
    const scrollSpeed = 0.5
    
    const animate = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed
        
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0
        }
        
        scrollContainer.scrollLeft = scrollAmount
      }
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])
  
  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos]
  
  return (
    <div className="w-full py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">


        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling container */}
          <div
            ref={scrollRef}
            className="flex items-center gap-16 overflow-x-hidden"
            style={{
              scrollBehavior: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ minWidth: '150px' }}
              >
                <img
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300"
                  style={{ filter: 'grayscale(100%) contrast(100%)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

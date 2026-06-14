'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'See your recent sessions and what you accomplished, at a glance.',
    image: '/images/overview.png'
  },
  {
    id: 'sessions',
    title: 'Sessions',
    description: 'Each session you run, with the work it captured and the report it produced.',
    image: '/images/sessions.png'
  },
  {
    id: 'workspace',
    title: 'Workspace',
    description: 'Keep your projects and reports organized in one place.',
    image: '/images/workspace.png'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'A view of your skills and accomplishments as they build up over time.',
    image: '/images/analytics.png'
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'AI-written reports of your real work — your skills, accomplishments and impact.',
    image: '/images/reports.png'
  },
  {
    id: 'shared-reports',
    title: 'Shared Reports',
    description: 'Send a verified report to a client or employer as one link.',
    image: '/images/shared-reports.png'
  }
]

export function AppShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-alt)' }}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeIndex === index ? 'var(--accent)' : 'transparent',
                color: activeIndex === index ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {slide.title}
            </button>
          ))}
        </div>
      </div>

      {/* Slideshow */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text)' }} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <ChevronRight className="w-5 h-5" style={{ color: 'var(--text)' }} />
        </button>

        {/* Image Container */}
        <div className="relative overflow-hidden rounded-xl img-bordered">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="w-full flex-shrink-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1024px"
                  priority={slide.id === 'overview'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-medium mb-2">{slides[activeIndex].title}</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {slides[activeIndex].description}
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: activeIndex === index ? 'var(--accent)' : 'var(--border)',
                width: activeIndex === index ? '24px' : '8px'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

const phrases = [
  'Your experience…',
  'Your resume…',
  'Your cv…',
  'Your skills…'
]

export function TypewriterText() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 2500)
      return () => clearTimeout(pauseTimer)
    }

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false)
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        return
      }

      const deleteTimer = setTimeout(() => {
        setCurrentText(currentText.slice(0, -1))
      }, 70)
      return () => clearTimeout(deleteTimer)
    }

    if (currentText === currentPhrase) {
      setIsPaused(true)
      return
    }

    const typeTimer = setTimeout(() => {
      setCurrentText(currentPhrase.slice(0, currentText.length + 1))
    }, 150)
    return () => clearTimeout(typeTimer)
  }, [currentText, currentPhraseIndex, isDeleting, isPaused])

  return (
    <span className="inline-block">
      {currentText}
      <span className="animate-blink">|</span>
    </span>
  )
}

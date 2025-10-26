import { useEffect, RefObject } from 'react'
import { createTimeline } from 'animejs'

export function useHeroEntrance(refs: RefObject<HTMLElement>[]) {
  useEffect(() => {
    // Check if all refs are available
    if (refs.some(ref => !ref.current)) return

    const timeline = createTimeline({
      defaults: {
        ease: 'out-expo',
      },
    })

    // Add each element to the timeline with staggered timing
    refs.forEach((ref, index) => {
      timeline.add(ref.current!, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
      }, index === 0 ? 0 : '-=400') // Overlap animations by 400ms
    })
  }, [refs])
}

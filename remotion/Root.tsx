import { Composition } from 'remotion'
import { TheCounter } from './TheCounter'

const FPS = 30
const DURATION = 900 // 30s

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vertical (Reels/TikTok) */}
      <Composition
        id="TheCounter"
        component={TheCounter}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
      {/* Wide (site / YouTube) — same composition, 16:9 */}
      <Composition
        id="TheCounterWide"
        component={TheCounter}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  )
}

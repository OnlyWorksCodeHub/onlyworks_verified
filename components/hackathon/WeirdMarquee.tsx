const IDEAS = [
  'a CRT that boots only when you cry into it',
  'a chess engine that resigns out of embarrassment',
  'a search engine that returns one (1) correct result',
  'a thermal printer that prints your dreams',
  'an RSS reader for vending machines',
  'a fitness tracker for houseplants',
  'a debugger that argues back',
  'a dating app for compilers',
  'morse-code RGB keyboard for one person',
  'a smoke detector that respects boundaries',
  'a unicorn that signs APK files',
  'a mouse that flees from sudo',
  'cursor.exe but it leaves a snail trail',
  'a markdown editor written entirely in markdown',
  'a captcha that just trusts you',
  'a printer that asks permission first',
  'a search bar that talks back',
  'an oscilloscope that visualizes regret',
]

interface WeirdMarqueeProps {
  inverted?: boolean
}

export function WeirdMarquee({ inverted = false }: WeirdMarqueeProps) {
  const doubled = [...IDEAS, ...IDEAS]
  return (
    <div className={inverted ? 'ow-marquee-bar ow-marquee-bar-red' : 'ow-marquee-bar'}>
      <div className="ow-marquee-track">
        {doubled.map((idea, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontWeight: 900 }}>★</span>
            <span>{idea}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

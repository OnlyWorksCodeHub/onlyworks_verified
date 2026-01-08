'use client'

const logos = [
  { name: 'Perplexity', src: 'https://framerusercontent.com/images/H2uMsivchZzjvRhz3xCe7yheV0.png?scale-down-to=512' },
  { name: 'Cursor', src: 'https://framerusercontent.com/images/k9s5vZXPE3VedLHG3a2tdOHjXqg.png?scale-down-to=1024' },
  { name: 'Monte Carlo', src: 'https://framerusercontent.com/images/p1HJ3s3sG81YrDBopNCzCulPwk.png?scale-down-to=512' },
  { name: 'JuiceBox', src: 'https://framerusercontent.com/images/9XDPJRrhKtLTjS9HKCRFtXeDs1E.svg' },
  { name: 'KPMG', src: 'https://www.datocms-assets.com/157377/1743003306-kpmg.png' },
]

export function LogoCarousel() {
  return (
    <div className="w-full overflow-hidden">
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="logo-carousel-track">
          {/* First set */}
          {logos.map((logo, index) => (
            <div
              key={`first-${logo.name}-${index}`}
              className="logo-carousel-item"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="h-8 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((logo, index) => (
            <div
              key={`second-${logo.name}-${index}`}
              className="logo-carousel-item"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className="h-8 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

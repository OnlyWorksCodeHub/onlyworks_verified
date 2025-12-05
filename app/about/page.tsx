'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Ultra minimal header */}
      <header className="w-full px-12 py-12">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-sm font-light text-black tracking-wider">
            ✱ONLYWORKS
          </Link>

          <div className="flex items-center gap-6 text-xs font-light uppercase tracking-wider">
            <Link href="/about" className="text-gray-400 hover:text-gray-700 transition-colors">
              Company
            </Link>
            <Link href="/careers" className="text-gray-400 hover:text-gray-700 transition-colors">
              Careers
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-700 transition-colors">
              Partners
            </Link>
            <div className="flex gap-3 ml-2">
              <a href="https://x.com/OnlyWorksAI" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/only-works" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main content - positioned lower with more space */}
      <main className="flex-1 flex items-center px-12">
        <div className="w-full max-w-2xl" style={{ marginTop: '-5%' }}>
          <h1 className="text-4xl font-light text-black mb-6 leading-tight">
            Building the future of work
          </h1>

          <p className="text-base font-light text-gray-600 leading-relaxed mb-8">
            We're on a mission to make work undeniable.
            <br />
            Our AI-powered platform authenticates genuine productivity,
            <br />
            helping professionals prove their value and build trust.
          </p>

          <button className="px-5 py-2.5 bg-blue-500 text-white text-sm font-light rounded hover:bg-blue-600 transition-colors">
            Learn more →
          </button>
        </div>
      </main>
    </div>
  )
}
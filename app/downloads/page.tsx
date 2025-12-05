'use client'

import Link from 'next/link'

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 px-12 py-10">
        <nav className="flex justify-between items-start">
          <div className="text-[13px] text-gray-700">
            ✱ ONLYWORKS
          </div>

          <div className="flex items-center gap-8 text-[11px] text-gray-400">
            <Link href="/about" className="hover:text-gray-600">COMPANY</Link>
            <Link href="/careers" className="hover:text-gray-600">CAREERS</Link>
            <Link href="/contact" className="hover:text-gray-600">PARTNERS</Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="h-screen flex items-center">
        <div className="px-12 max-w-4xl">
          <h1 className="text-[40px] leading-tight font-normal text-gray-900 mb-6">
            Coming soon
          </h1>

          <p className="text-[15px] leading-relaxed text-gray-600 mb-8 max-w-md">
            OnlyWorks Desktop is currently in private beta.<br/>
            Join the waitlist to get early access<br/>
            when we launch.
          </p>

          <a
            href="mailto:admin@only-works.com?subject=OnlyWorks Desktop Access"
            className="inline-block px-5 py-2.5 bg-[#0066FF] text-white text-[13px] rounded hover:bg-[#0052CC] transition-colors"
          >
            Request access →
          </a>
        </div>
      </main>
    </div>
  )
}
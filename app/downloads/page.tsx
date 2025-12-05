'use client'

import Link from 'next/link'
import { CURRENT_VERSION } from '@/lib/app-versions'

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
            Download OnlyWorks Desktop
          </h1>

          <p className="text-[15px] leading-relaxed text-gray-600 mb-8 max-w-md">
            Version {CURRENT_VERSION.version} • Released {CURRENT_VERSION.releaseDate}
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-[13px] font-medium text-gray-700 mb-2">macOS</h3>
              <div className="flex gap-3">
                <a
                  href={CURRENT_VERSION.platforms.mac.arm64.url}
                  className="inline-block px-5 py-2.5 bg-[#0066FF] text-white text-[13px] rounded hover:bg-[#0052CC] transition-colors"
                  download
                >
                  Download for Apple Silicon ({CURRENT_VERSION.platforms.mac.arm64.size})
                </a>
                <a
                  href={CURRENT_VERSION.platforms.mac.intel.url}
                  className="inline-block px-5 py-2.5 bg-gray-600 text-white text-[13px] rounded hover:bg-gray-700 transition-colors"
                  download
                >
                  Download for Intel ({CURRENT_VERSION.platforms.mac.intel.size})
                </a>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Requires macOS {CURRENT_VERSION.minOS.mac} or later
              </p>
            </div>

            {CURRENT_VERSION.platforms.windows.x64.url && (
              <div>
                <h3 className="text-[13px] font-medium text-gray-700 mb-2">Windows</h3>
                <a
                  href={CURRENT_VERSION.platforms.windows.x64.url}
                  className="inline-block px-5 py-2.5 bg-[#0066FF] text-white text-[13px] rounded hover:bg-[#0052CC] transition-colors"
                  download
                >
                  Download for Windows ({CURRENT_VERSION.platforms.windows.x64.size})
                </a>
                <p className="text-[11px] text-gray-500 mt-2">
                  Requires Windows {CURRENT_VERSION.minOS.windows} or later
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-[13px] font-medium text-gray-700 mb-2">What's new</h3>
            <ul className="text-[13px] text-gray-600 space-y-1">
              {CURRENT_VERSION.releaseNotes.map((note, index) => (
                <li key={index}>• {note}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
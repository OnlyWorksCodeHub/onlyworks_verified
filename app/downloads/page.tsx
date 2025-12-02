'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Download, Monitor, Laptop, Lock, Key } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface VersionInfo {
  version: string
  releaseDate: string
  platforms: any
  releaseNotes: string[]
  minOS: any
}

export default function DownloadsPage() {
  const [accessCode, setAccessCode] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const [error, setError] = useState('')
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  const correctAccessCode = 'OW2025@!' // You can change this to any code you want

  // Fetch version info on mount
  useEffect(() => {
    if (hasAccess) {
      fetchVersionInfo()
    }
  }, [hasAccess])

  const fetchVersionInfo = async () => {
    try {
      const response = await fetch('/api/desktop/version')
      const data = await response.json()
      setVersionInfo(data)
    } catch (err) {
      console.error('Failed to fetch version info:', err)
    }
  }

  const handleDownload = async (platform: string, arch: string) => {
    const downloadKey = `${platform}-${arch}`
    setDownloading(downloadKey)

    try {
      // Track download via API
      const response = await fetch('/api/desktop/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, arch }),
      })

      const data = await response.json()

      if (data.success && data.downloadUrl) {
        // Use proxy download for direct file download (no GitHub redirect)
        const fileName = data.downloadUrl.split('/').pop() || 'OnlyWorks-Desktop'
        const proxyUrl = `/api/desktop/proxy-download?url=${encodeURIComponent(data.downloadUrl)}&filename=${encodeURIComponent(fileName)}`

        // Create download link
        const link = document.createElement('a')
        link.href = proxyUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success(`Downloading OnlyWorks Desktop v${data.version}`)
      } else if (data.available === false) {
        toast.error('This platform is not available yet. Coming soon!')
      } else {
        throw new Error('Failed to get download URL')
      }
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to start download. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessCode.toUpperCase() === correctAccessCode) {
      setHasAccess(true)
      setError('')
    } else {
      setError('Invalid access code. Please try again.')
    }
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[#5b70f8]/10 p-3 rounded-full">
                <Lock className="h-8 w-8 text-[#5b70f8]" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Access Required
            </h2>

            <p className="text-gray-600 mb-6">
              Please enter your access code to download OnlyWorks Desktop.
            </p>

            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b70f8] focus:border-transparent text-white placeholder:text-gray-400"
                  style={{ color: '#ffffff' }}
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#5b70f8] text-white rounded-lg hover:bg-[#5b70f8]/90 transition-colors font-semibold"
              >
                Access Downloads
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <p className="text-sm text-gray-600">
                Interested to try it out? Reach out to us at{' '}
                <a
                  href="mailto:admin@only-works.com"
                  className="text-[#5b70f8] hover:text-[#5b70f8]/80 transition-colors"
                >
                  admin@only-works.com
                </a>
              </p>

              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Link href="/" className="flex items-center justify-center mb-8">
            <Image
              src="/images/onlyworks-logo.png"
              alt="OnlyWorks"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Download OnlyWorks Desktop
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the desktop app to track your productivity and focus sessions with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Mac Downloads */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <Laptop className="h-16 w-16 text-gray-700" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              macOS
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Compatible with macOS 10.15 and later
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleDownload('mac', 'arm64')}
                disabled={downloading === 'mac-arm64'}
                className="flex items-center justify-center w-full px-6 py-3 bg-[#5b70f8] text-white rounded-lg hover:bg-[#5b70f8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-5 w-5 mr-2" />
                {downloading === 'mac-arm64' ? 'Downloading...' : 'Download for Apple Silicon (M1/M2)'}
              </button>

              <button
                onClick={() => handleDownload('mac', 'intel')}
                disabled={downloading === 'mac-intel'}
                className="flex items-center justify-center w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-5 w-5 mr-2" />
                {downloading === 'mac-intel' ? 'Downloading...' : 'Download for Intel Mac'}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Version {versionInfo?.version || '1.0.0'} • ~{versionInfo?.platforms?.mac?.arm64?.size || '97MB'}
            </p>
          </div>

          {/* Windows Downloads */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <Monitor className="h-16 w-16 text-gray-700" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              Windows
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              Compatible with Windows 10 and later
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleDownload('windows', 'x64')}
                disabled={downloading === 'windows-x64'}
                className="flex items-center justify-center w-full px-6 py-3 bg-[#5b70f8] text-white rounded-lg hover:bg-[#5b70f8]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-5 w-5 mr-2" />
                {downloading === 'windows-x64' ? 'Downloading...' : 'Download for Windows'}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Version {versionInfo?.version || '1.0.0'} • ~{versionInfo?.platforms?.windows?.x64?.size || '74MB'}
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need help? Check out our <Link href="/support" className="text-blue-600 hover:text-blue-800">support page</Link> or <Link href="/contact" className="text-blue-600 hover:text-blue-800">contact us</Link>.
          </p>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
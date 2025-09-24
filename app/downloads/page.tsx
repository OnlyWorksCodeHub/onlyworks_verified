import Link from 'next/link'
import { Download, Monitor, Laptop } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Link href="/" className="flex items-center space-x-2 justify-center mb-8">
            <Logo size={48} />
            <span className="text-2xl font-semibold text-gray-900">OnlyWorks</span>
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
              <a
                href="/downloads/OnlyWorks Desktop-1.0.0-arm64.dmg"
                className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                download
              >
                <Download className="h-5 w-5 mr-2" />
                Download for Apple Silicon (M1/M2)
              </a>

              <a
                href="/downloads/OnlyWorks Desktop-1.0.0.dmg"
                className="flex items-center justify-center w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                download
              >
                <Download className="h-5 w-5 mr-2" />
                Download for Intel Mac
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Version 1.0.0 • ~97MB
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
              <a
                href="/downloads/OnlyWorks Desktop Setup 1.0.0.exe"
                className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                download
              >
                <Download className="h-5 w-5 mr-2" />
                Download for Windows
              </a>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Version 1.0.0 • ~74MB
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
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-8">
          <Link href="/" className="flex items-center space-x-2 justify-center">
            <Logo size={48} />
            <span className="text-2xl font-semibold text-gray-900">OnlyWorks</span>
          </Link>
        </div>

        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Coming Soon
        </h1>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          We're building something amazing. Stay tuned!
        </p>

        <Link
          href="/"
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
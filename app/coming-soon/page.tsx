import Link from 'next/link'
import Image from 'next/image'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="mb-8">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/images/onlyworks-logo.png"
              alt="OnlyWorks"
              width={192}
              height={48}
              className="h-12 w-auto"
            />
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
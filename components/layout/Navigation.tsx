import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size={40} />
              <span className="text-xl font-semibold text-[#5c5ce6]">OnlyWorks</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="/pricing" className="text-[#5c5ce6] hover:text-[#4c4cd6] transition">Pricing</Link>
              <Link href="/about" className="text-[#5c5ce6] hover:text-[#4c4cd6] transition">About Us</Link>
              <Link href="/teams" className="text-[#5c5ce6] hover:text-[#4c4cd6] transition">Teams</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/contact" className="px-5 py-2.5 bg-[#5c5ce6] text-white rounded-lg hover:bg-[#4c4cd6] transition">
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

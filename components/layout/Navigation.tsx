import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-[#0A0A0A]/90 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size={40} />
              <span className="text-xl font-semibold text-white">OnlyWorks</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition">About</Link>
              <Link href="/teams" className="text-gray-400 hover:text-white transition">Teams</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/contact" className="px-5 py-2.5 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition">
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

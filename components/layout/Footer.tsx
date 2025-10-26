import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/images/onlyworks-logo.png"
                alt="OnlyWorks"
                width={128}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm mb-4">The AI Backbone of Credibility...</p>

            {/* Social Media Icons */}
            <div className="flex space-x-6">
            <a
              href="https://x.com/OnlyWorksAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition p-2 -m-2"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/only-works"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition p-2 -m-2"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@OnlyWorksAI"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition p-2 -m-2"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link></li>
              <li><Link href="/teams" className="text-gray-600 hover:text-gray-900 text-sm">Teams</Link></li>
              <li><Link href="/coming-soon" className="text-gray-600 hover:text-gray-900 text-sm">Business</Link></li>
              <li><Link href="/downloads" className="text-gray-600 hover:text-gray-900 text-sm">Download</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">Careers</Link></li>
              <li><Link href="/updates" className="text-gray-600 hover:text-gray-900 text-sm">Updates</Link></li>
              <li><Link href="/coming-soon" className="text-gray-600 hover:text-gray-900 text-sm">Collaborate with us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link></li>
              <li><Link href="/pricing#faq" className="text-gray-600 hover:text-gray-900 text-sm">FAQs</Link></li>
              <li><Link href="/coming-soon" className="text-gray-600 hover:text-gray-900 text-sm">Tutorial</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2025 OnlyWorks. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-gray-900 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-900 transition">Terms of Service</Link>
              <Link href="/security" className="hover:text-gray-900 transition">Security</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image src="/images/logo.png" alt="OnlyWorks" width={28} height={28} className="logo-icon mb-3" />
            <p className="text-sm" style={{ color: '#a3a19b', maxWidth: '240px', fontSize: '0.875rem' }}>
              Verified proof of your work. Built for students, freelancers, and professionals.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: '#080503' }}>Product</h4>
            <div className="space-y-2">
              <Link href="/downloads" className="footer-link block">Download</Link>
              <Link href="/about" className="footer-link block">About</Link>
              <Link href="/hiring" className="footer-link block">For Hiring Managers</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: '#080503' }}>Company</h4>
            <div className="space-y-2">
              <Link href="/careers" className="footer-link block">Careers</Link>
              <Link href="/support" className="footer-link block">Support</Link>
              <Link href="/support/tickets" className="footer-link block">Support tickets</Link>
              <Link href="/contact" className="footer-link block">Contact</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium mb-3" style={{ color: '#080503' }}>Legal</h4>
            <div className="space-y-2">
              <Link href="/privacy" className="footer-link block">Privacy</Link>
              <Link href="/terms" className="footer-link block">Terms</Link>
              <Link href="/security" className="footer-link block">Security</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center py-6 border-t" style={{ borderColor: '#dad7d0' }}>
          <span className="text-xs" style={{ color: '#a3a19b' }}>
            &copy; {new Date().getFullYear()} OnlyWorks
          </span>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import { Mail, MessageSquare, MapPin } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-10">
              <Link href="/" className="flex items-center space-x-2">
                <Logo size={32} />
                <span className="text-xl font-semibold text-gray-900">OnlyWorks</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">Careers</Link>
                <Link href="/updates" className="text-gray-600 hover:text-gray-900 text-sm">Updates</Link>
                <Link href="/contact" className="text-primary hover:text-primary-dark text-sm font-medium">Contact</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/coming-soon" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
            Book a Demo
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            See OnlyWorks in action. Schedule a personalized demo with our team.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sales Inquiries</h3>
              <p className="text-gray-600 mb-4">Questions about pricing or features?</p>
              <a href="mailto:admin@only-works.com" className="text-primary hover:text-primary-dark">
                admin@only-works.com
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">Custom solutions for large teams</p>
              <a href="mailto:admin@only-works.com" className="text-primary hover:text-primary-dark">
                admin@only-works.com
              </a>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Partnership</h3>
              <p className="text-gray-600 mb-4">Interested in partnering with us?</p>
              <a href="mailto:admin@only-works.com" className="text-primary hover:text-primary-dark">
                admin@only-works.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Schedule Your Demo</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Team Size</label>
              <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none">
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-1000 employees</option>
                <option>1000+ employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">What would you like to see in the demo?</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Tell us about your specific use case or what features you're most interested in..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition font-medium"
            >
              Book Demo
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

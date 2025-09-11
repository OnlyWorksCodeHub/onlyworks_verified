import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Mail, MessageSquare, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Book a Demo
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            See OnlyWorks in action. Schedule a personalized demo with our team.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-[#5E5CE6] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sales Inquiries</h3>
              <p className="text-gray-400 mb-4">Questions about pricing or features?</p>
              <a href="mailto:sales@onlyworks.com" className="text-[#5E5CE6] hover:text-[#4E4CD6]">
                sales@onlyworks.com
              </a>
            </div>
            
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
              <MessageSquare className="w-12 h-12 text-[#5E5CE6] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-4">Custom solutions for large teams</p>
              <a href="mailto:enterprise@onlyworks.com" className="text-[#5E5CE6] hover:text-[#4E4CD6]">
                enterprise@onlyworks.com
              </a>
            </div>
            
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
              <MapPin className="w-12 h-12 text-[#5E5CE6] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Partnership</h3>
              <p className="text-gray-400 mb-4">Interested in partnering with us?</p>
              <a href="mailto:partners@onlyworks.com" className="text-[#5E5CE6] hover:text-[#4E4CD6]">
                partners@onlyworks.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Schedule Your Demo</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                placeholder="Your company name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Team Size</label>
              <select className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none">
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-1000 employees</option>
                <option>1000+ employees</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">What would you like to see in the demo?</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                placeholder="Tell us about your specific use case or what features you're most interested in..."
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-8 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition font-medium"
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

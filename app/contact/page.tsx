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
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Have questions about OnlyWorks? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-[#5E5CE6] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-400 mb-4">Get in touch for general inquiries</p>
              <a href="mailto:hello@onlyworks.com" className="text-[#5E5CE6] hover:text-[#4E4CD6]">
                hello@onlyworks.com
              </a>
            </div>
            
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
              <MessageSquare className="w-12 h-12 text-[#5E5CE6] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Support</h3>
              <p className="text-gray-400 mb-4">Need help with OnlyWorks?</p>
              <a href="mailto:support@onlyworks.com" className="text-[#5E5CE6] hover:text-[#4E4CD6]">
                support@onlyworks.com
              </a>
            </div>
            
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-8 text-center">
              <MapPin className="w-12 h-12 text-[#5E5CE6] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Office</h3>
              <p className="text-gray-400 mb-4">We're fully remote</p>
              <p className="text-[#5E5CE6]">Worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Send Us a Message</h2>
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
              <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
              <select className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Sales</option>
                <option>Partnerships</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                placeholder="How can we help you?"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-8 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

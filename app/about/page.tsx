import Link from 'next/link'
import { Target, Eye, Lock, Users } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
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
                <Link href="/teams" className="text-gray-600 hover:text-gray-900 text-sm">Teams</Link>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">Careers</Link>
                <Link href="/updates" className="text-gray-600 hover:text-gray-900 text-sm">Updates</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link>
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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
            Proving Work is <span className="text-primary">Real</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            In a world of remote work and AI assistance, how do you prove your work is genuine?
            OnlyWorks was built to solve the trust problem in modern work.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We believe that honest, hard-working professionals deserve a way to prove their value.
              Whether you're a freelancer showing clients your effort, a remote employee demonstrating
              productivity, or a team lead ensuring quality work, OnlyWorks provides the verification you need.
            </p>
            <p className="text-gray-600">
              Our AI-powered platform tracks real work patterns, detects automation, and creates
              tamper-proof reports that anyone can verify. No more doubts about outsourcing,
              no more questions about productivity—just clear, verifiable proof of genuine work.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Target className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Accuracy</h3>
              <p className="text-sm text-gray-600">98% fraud detection rate</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Eye className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-sm text-gray-600">Public verification system</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Lock className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Privacy</h3>
              <p className="text-sm text-gray-600">Your data stays yours</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Users className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-sm text-gray-600">Used by 10,000+ professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">T</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Truth First</h3>
              <p className="text-gray-600">
                We never compromise on accuracy. Every verification is thorough and honest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">P</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy Matters</h3>
              <p className="text-gray-600">
                We track productivity, not personal data. Your privacy is non-negotiable.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">E</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empower Workers</h3>
              <p className="text-gray-600">
                We help professionals prove their worth and improve their productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

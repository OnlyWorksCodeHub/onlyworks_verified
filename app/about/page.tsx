import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Target, Eye, Lock, Users } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Proving Work is
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E5CE6] to-[#9F9FFF]">
                {' '}Real
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              In a world of remote work and AI assistance, how do you prove your work is genuine? 
              OnlyWorks was built to solve the trust problem in modern work.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
            <p className="text-gray-400 mb-4">
              We believe that honest, hard-working professionals deserve a way to prove their value. 
              Whether you're a freelancer showing clients your effort, a remote employee demonstrating 
              productivity, or a team lead ensuring quality work, OnlyWorks provides the verification you need.
            </p>
            <p className="text-gray-400">
              Our AI-powered platform tracks real work patterns, detects automation, and creates 
              tamper-proof reports that anyone can verify. No more doubts about outsourcing, 
              no more questions about productivity—just clear, verifiable proof of genuine work.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Target className="w-8 h-8 text-[#5E5CE6] mb-3" />
              <h3 className="font-semibold text-white mb-2">Accuracy</h3>
              <p className="text-sm text-gray-400">98% fraud detection rate</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Eye className="w-8 h-8 text-[#5E5CE6] mb-3" />
              <h3 className="font-semibold text-white mb-2">Transparency</h3>
              <p className="text-sm text-gray-400">Public verification system</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Lock className="w-8 h-8 text-[#5E5CE6] mb-3" />
              <h3 className="font-semibold text-white mb-2">Privacy</h3>
              <p className="text-sm text-gray-400">Your data stays yours</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Users className="w-8 h-8 text-[#5E5CE6] mb-3" />
              <h3 className="font-semibold text-white mb-2">Trust</h3>
              <p className="text-sm text-gray-400">Used by 10,000+ professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Truth First</h3>
              <p className="text-gray-400">
                We never compromise on accuracy. Every verification is thorough and honest.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Privacy Matters</h3>
              <p className="text-gray-400">
                We track productivity, not personal data. Your privacy is non-negotiable.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Empower Workers</h3>
              <p className="text-gray-400">
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

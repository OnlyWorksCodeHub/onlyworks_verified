import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { LogoCarousel } from '@/components/ui/logo-carousel'
import { ArrowRight, Shield, Brain, TrendingUp, Award, Users, CheckCircle, Play, BarChart3, Clock, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero Section */}
      <section className="px-8 pt-32 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold text-white mb-2">Track Your</h1>
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E5CE6] to-[#9F9FFF]">
                Productivity
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              AI-powered workflow analytics that help you understand and improve your 
              work patterns. Simple, private, effective.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/contact" className="px-6 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition font-medium">
                Book a Demo
              </Link>
              <Link href="/contact" className="flex items-center space-x-2 text-gray-400 hover:text-white transition">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-[#1A1A1A] rounded-2xl p-2">
              <div className="bg-black rounded-xl aspect-video flex items-center justify-center">
                <button className="w-16 h-16 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <LogoCarousel />

      {/* Trust Indicators */}
      <section className="py-12 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#5E5CE6]">98%</div>
              <div className="text-sm text-gray-500">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#5E5CE6]">24/7</div>
              <div className="text-sm text-gray-500">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#5E5CE6]">50+</div>
              <div className="text-sm text-gray-500">Metrics Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#5E5CE6]">Bank-Level</div>
              <div className="text-sm text-gray-500">Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Complete Work Verification</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Prove your work is real, efficient, and authentic with our comprehensive tracking system
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Shield className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Fraud Detection</h3>
              <p className="text-gray-400">
                Detects 20+ automation tools and suspicious patterns. Proves your work is genuinely human.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Brain className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">AI Usage Analysis</h3>
              <p className="text-gray-400">
                Shows how effectively you use AI tools. Proves understanding, not just copy-paste.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <TrendingUp className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Efficiency Metrics</h3>
              <p className="text-gray-400">
                Tracks focus time, task completion, and workflow patterns. Get actionable improvement tips.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Award className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Shareable Reports</h3>
              <p className="text-gray-400">
                Generate professional reports with verification codes. Anyone can verify authenticity.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Users className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">All Professions</h3>
              <p className="text-gray-400">
                Works for developers, designers, finance, marketing, and any knowledge worker.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <CheckCircle className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Instant Feedback</h3>
              <p className="text-gray-400">
                Real-time coaching on what you're doing well and what could improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#5E5CE6]">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Start Recording</h3>
              <p className="text-gray-400">
                Begin a work session and share your screen. We track clicks, keystrokes, and activity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#5E5CE6]">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI Analysis</h3>
              <p className="text-gray-400">
                Our AI analyzes your work patterns, detects automation, and measures productivity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#5E5CE6]">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Get Report</h3>
              <p className="text-gray-400">
                Receive detailed feedback and a shareable verification report with proof of work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Start Building Trust Today
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of professionals who prove their work is real
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="px-8 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition font-medium">
              Book a Demo
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
            <Link href="/pricing" className="px-8 py-3 border border-gray-700 text-white rounded-lg hover:bg-gray-900 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

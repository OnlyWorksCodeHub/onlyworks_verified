import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { ArrowRight, Users, Shield, BarChart3, Zap } from 'lucide-react'

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Built for Teams That
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E5CE6] to-[#9F9FFF]">
              {' '}Ship Real Work
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Ensure every team member's work is genuine and efficient. Get team-wide insights, 
            detect automation, and create verifiable reports for clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-8 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition">
              Start Team Trial
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
            <Link href="/contact" className="px-8 py-3 border border-gray-700 text-white rounded-lg hover:bg-gray-900 transition">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Team Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Users className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Team Dashboard</h3>
              <p className="text-gray-400">
                See all team members' productivity in one place. Track who's working on what.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Shield className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Fraud Prevention</h3>
              <p className="text-gray-400">
                Detect outsourcing, automation tools, and suspicious patterns across your team.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <BarChart3 className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Team Analytics</h3>
              <p className="text-gray-400">
                Compare productivity, identify top performers, and optimize team workflows.
              </p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <Zap className="w-12 h-12 text-[#5E5CE6] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Client Reports</h3>
              <p className="text-gray-400">
                Generate verified team reports to prove deliverables and billable hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Perfect For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Agencies</h3>
              <p className="text-gray-400 mb-4">
                Prove to clients that their projects are being worked on by real professionals, not outsourced or automated.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Client transparency</li>
                <li>• Billable hour verification</li>
                <li>• Project accountability</li>
              </ul>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Remote Teams</h3>
              <p className="text-gray-400 mb-4">
                Build trust in distributed teams. Know everyone is contributing their fair share.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Remote work verification</li>
                <li>• Team productivity insights</li>
                <li>• Performance tracking</li>
              </ul>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Startups</h3>
              <p className="text-gray-400 mb-4">
                Ensure your limited resources are being used efficiently. Identify and fix productivity issues fast.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Resource optimization</li>
                <li>• Early issue detection</li>
                <li>• Growth insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Simple Team Pricing</h2>
          <p className="text-xl text-gray-400 mb-8">
            $29 per user per month. Volume discounts available.
          </p>
          <Link href="/pricing" className="px-8 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition">
            View Full Pricing
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

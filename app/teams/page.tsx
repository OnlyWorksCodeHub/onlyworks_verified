import Link from 'next/link'
import { ArrowRight, Users, Shield, BarChart3, Zap } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/Footer'

export default function TeamsPage() {
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
                <Link href="/teams" className="text-primary hover:text-primary-dark text-sm font-medium">Teams</Link>
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
            Built for Teams That <span className="text-primary">Ship Real Work</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ensure every team member's work is genuine and efficient. Get team-wide insights,
            detect automation, and create verifiable reports for clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coming-soon" className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition">
              Start Team Trial
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
            <Link href="/contact" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Team Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Dashboard</h3>
              <p className="text-gray-600">
                See all team members' productivity in one place. Track who's working on what.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fraud Prevention</h3>
              <p className="text-gray-600">
                Detect outsourcing, automation tools, and suspicious patterns across your team.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <BarChart3 className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Analytics</h3>
              <p className="text-gray-600">
                Compare productivity, identify top performers, and optimize team workflows.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Client Reports</h3>
              <p className="text-gray-600">
                Generate verified team reports to prove deliverables and billable hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Perfect For</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Agencies</h3>
              <p className="text-gray-600 mb-4">
                Prove to clients that their projects are being worked on by real professionals, not outsourced or automated.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Client transparency</li>
                <li>• Billable hour verification</li>
                <li>• Project accountability</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Remote Teams</h3>
              <p className="text-gray-600 mb-4">
                Build trust in distributed teams. Know everyone is contributing their fair share.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Remote work verification</li>
                <li>• Team productivity insights</li>
                <li>• Performance tracking</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Startups</h3>
              <p className="text-gray-600 mb-4">
                Ensure your limited resources are being used efficiently. Identify and fix productivity issues fast.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Resource optimization</li>
                <li>• Early issue detection</li>
                <li>• Growth insights</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900">Simple Team Pricing</h2>
          <p className="text-lg text-gray-600 mb-8">
            $29 per user per month. Volume discounts available.
          </p>
          <Link href="/pricing" className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition">
            View Full Pricing
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

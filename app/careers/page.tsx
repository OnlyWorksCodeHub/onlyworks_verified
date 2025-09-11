import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowRight, MapPin, Clock, Briefcase } from 'lucide-react'

export default function CareersPage() {
  const openings = [
    {
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build the future of productivity verification technology with our core engineering team.'
    },
    {
      title: 'Machine Learning Engineer',
      department: 'AI/ML',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop AI models to detect patterns and analyze productivity metrics.'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create intuitive experiences for productivity tracking and reporting.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help customers maximize their productivity with OnlyWorks.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Maintain and scale our infrastructure to support millions of work sessions.'
    },
    {
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Tell the OnlyWorks story and educate the market about productivity verification.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Join Our Mission to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E5CE6] to-[#9F9FFF]">
              {' '}Redefine Work
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            We're building the future of productivity verification. Join us in creating tools that help millions prove their work is real.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Work Here</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Growth</h3>
              <p className="text-gray-400">
                Fast-paced environment where you'll learn and grow every day.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Remote First</h3>
              <p className="text-gray-400">
                Work from anywhere. We trust you to manage your own productivity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5E5CE6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Impact</h3>
              <p className="text-gray-400">
                Your work directly impacts how millions prove their productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Open Positions</h2>
          <div className="space-y-6">
            {openings.map((job, index) => (
              <div key={index} className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 hover:border-[#5E5CE6] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                    <p className="text-gray-400 mb-4">{job.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Link href={`mailto:careers@onlyworks.com?subject=Application for ${job.title}`} className="px-4 py-2 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition">
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <span className="text-2xl mb-3 block">💰</span>
              <h3 className="text-lg font-semibold text-white mb-2">Competitive Salary</h3>
              <p className="text-gray-400 text-sm">Top of market compensation with equity</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <span className="text-2xl mb-3 block">🏥</span>
              <h3 className="text-lg font-semibold text-white mb-2">Health Coverage</h3>
              <p className="text-gray-400 text-sm">100% covered health, dental, and vision</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <span className="text-2xl mb-3 block">🌴</span>
              <h3 className="text-lg font-semibold text-white mb-2">Unlimited PTO</h3>
              <p className="text-gray-400 text-sm">Take time when you need it</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <span className="text-2xl mb-3 block">💻</span>
              <h3 className="text-lg font-semibold text-white mb-2">Equipment Budget</h3>
              <p className="text-gray-400 text-sm">$3,000 for your home office setup</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <span className="text-2xl mb-3 block">📚</span>
              <h3 className="text-lg font-semibold text-white mb-2">Learning Budget</h3>
              <p className="text-gray-400 text-sm">$1,500/year for courses and conferences</p>
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <span className="text-2xl mb-3 block">✈️</span>
              <h3 className="text-lg font-semibold text-white mb-2">Team Retreats</h3>
              <p className="text-gray-400 text-sm">Quarterly in-person meetups</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Don't See Your Role?</h2>
          <p className="text-xl text-gray-400 mb-8">
            We're always looking for talented people. Send us your resume.
          </p>
          <Link href="mailto:careers@onlyworks.com" className="px-8 py-3 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition font-medium">
            Get in Touch
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

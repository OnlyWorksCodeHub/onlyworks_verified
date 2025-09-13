import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/Footer'

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time"
    }
  ]

  const values = [
    {
      title: "Transparency",
      description: "We believe in open communication and honest feedback. No hidden agendas, just clear expectations and genuine collaboration."
    },
    {
      title: "Excellence",
      description: "We set high standards for ourselves and our work. Quality isn't just a goal—it's our baseline for everything we deliver."
    },
    {
      title: "Innovation",
      description: "We're building the future of work verification. Every day, we push boundaries and explore new possibilities in AI and productivity."
    },
    {
      title: "Trust",
      description: "Trust is at the core of everything we do. We trust our team, our process, and our mission to make work undeniable."
    },
    {
      title: "Impact",
      description: "We're not just building software—we're solving real problems for real people and creating genuine value in the world."
    },
    {
      title: "Growth",
      description: "We invest in our people's growth and celebrate learning from both successes and failures. Your development is our priority."
    }
  ]

  const benefits = [
    "Comprehensive health, dental, and vision insurance",
    "Competitive salary and equity package",
    "Unlimited PTO and flexible working hours",
    "Latest tech and home office setup allowance",
    "Learning and development budget",
    "Fully remote-first company culture",
    "Generous parental leave policy",
    "Mental health and wellness support"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-10">
              <Link href="/" className="flex items-center space-x-2">
                <Logo size={32} />
                <span className="text-2xl font-semibold text-gray-900">OnlyWorks</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-base">Pricing</Link>
                <Link href="/careers" className="text-primary hover:text-primary-dark text-base font-medium">Careers</Link>
                <Link href="/updates" className="text-gray-600 hover:text-gray-900 text-base">Updates</Link>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-base">Contact</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/coming-soon" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-base">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-7xl md:text-8xl font-semibold text-gray-900 mb-6">
            Join us in making work <span className="text-primary">undeniable</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're building the future of work verification with AI. Join a team that values transparency,
            innovation, and genuine impact on how the world views productivity.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <span>100% Remote</span>
            <span>Pre-Seed Startup</span>
            <span>2-10 Team Members</span>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Why you'll love working here</h2>
              <p className="text-gray-600 mb-8">
                We believe that great work happens when people are supported, trusted, and empowered.
                Our benefits and culture are designed to help you do your best work while maintaining
                a healthy work-life balance.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <img src="/images/founders.png" alt="Founders" className="w-full h-auto rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Link
                    href="/coming-soon"
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 mt-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Don't see a role that fits?</h3>
            <p className="text-gray-700 mb-6">We're always looking for exceptional talent to join our mission of making work undeniable.</p>
            <Link href="/contact" className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition font-medium">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Culture</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            We're building more than just software—we're building a team of passionate individuals
            who believe in the power of authentic work. Our culture is built on trust, transparency,
            and the shared mission of making work verification accessible to everyone.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Collaborative</h3>
              <p className="text-gray-600">
                We believe the best ideas come from diverse perspectives working together toward a common goal.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Purpose-Driven</h3>
              <p className="text-gray-600">
                Every line of code, every design decision, and every strategy serves our mission of authentic work verification.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Growth-Minded</h3>
              <p className="text-gray-600">
                We invest in continuous learning and celebrate both individual growth and team achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

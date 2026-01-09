import Link from 'next/link'
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react'
import { Navigation } from '@/components/Navigation'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
}

const jobs: Job[] = [
  {
    id: 'marketing-intern',
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Remote',
    type: 'Internship',
    description: 'Join our marketing team to help build brand awareness, create engaging content, and support various marketing initiatives in a fast-paced startup environment.',
    requirements: [
      'Currently pursuing or recently completed a degree in Marketing or Communications',
      'Strong written and verbal communication skills',
      'Familiarity with social media platforms',
      'Self-motivated with ability to work independently'
    ]
  },
  {
    id: 'product-marketing-manager',
    title: 'Product Marketing Manager',
    department: 'Product Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Drive go-to-market strategy for our product launches. Own positioning, messaging, and competitive analysis to help OnlyWorks stand out in the market.',
    requirements: [
      '4+ years of product marketing experience in B2B SaaS',
      'Experience launching products and driving adoption',
      'Strong analytical and storytelling skills',
      'Ability to translate technical features into customer benefits'
    ]
  },
  {
    id: 'market-research-analyst',
    title: 'Market Research Analyst',
    department: 'Research',
    location: 'Remote',
    type: 'Full-time',
    description: 'Lead market research initiatives to uncover customer insights, competitive intelligence, and market trends that inform our product and marketing strategies.',
    requirements: [
      '3+ years of market research experience',
      'Proficiency in qualitative and quantitative research methods',
      'Experience with survey tools and data analysis',
      'Strong presentation and reporting skills'
    ]
  },
  {
    id: 'sales-development-rep',
    title: 'Sales Development Representative',
    department: 'Sales',
    location: 'Remote',
    type: 'Full-time',
    description: 'Be the first point of contact for potential customers. Generate and qualify leads through outbound prospecting and inbound lead follow-up.',
    requirements: [
      '1-2 years of sales or customer-facing experience',
      'Excellent communication and interpersonal skills',
      'Self-starter mentality with a hunger to learn',
      'Experience with CRM tools like Salesforce or HubSpot'
    ]
  },
  {
    id: 'content-marketing-manager',
    title: 'Content Marketing Manager',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create compelling content that educates and engages our target audience. Own our blog, case studies, whitepapers, and thought leadership content.',
    requirements: [
      '4+ years of content marketing experience',
      'Exceptional writing and editing skills',
      'Experience with SEO and content analytics',
      'Ability to distill complex topics into accessible content'
    ]
  },
  {
    id: 'growth-marketing-manager',
    title: 'Growth Marketing Manager',
    department: 'Growth',
    location: 'Remote',
    type: 'Full-time',
    description: 'Own and optimize our paid acquisition channels. Design and execute experiments to drive efficient customer acquisition and conversion.',
    requirements: [
      '3+ years of growth or performance marketing experience',
      'Hands-on experience with Google Ads, LinkedIn, and Meta',
      'Strong analytical skills and data-driven mindset',
      'Experience with A/B testing and CRO'
    ]
  },
  {
    id: 'brand-marketing-manager',
    title: 'Brand Marketing Manager',
    department: 'Brand',
    location: 'Remote',
    type: 'Full-time',
    description: 'Shape and evolve the OnlyWorks brand. Lead creative campaigns, manage brand guidelines, and ensure consistent messaging across all touchpoints.',
    requirements: [
      '5+ years of brand marketing experience',
      'Strong creative vision and design sensibility',
      'Experience managing agencies and creative teams',
      'Track record of building memorable brand campaigns'
    ]
  },
  {
    id: 'partnerships-manager',
    title: 'Partnerships Manager',
    department: 'Partnerships',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and manage strategic partnerships that expand our reach and add value for customers. Identify, negotiate, and execute partnership opportunities.',
    requirements: [
      '4+ years of business development or partnerships experience',
      'Strong negotiation and relationship-building skills',
      'Experience structuring and executing partnership deals',
      'Excellent project management abilities'
    ]
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge mb-6">We're Hiring</span>
            <h1 className="mb-6">Join our team</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Help us build the future of work verification. We're looking for talented people who want to make a real impact.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center">Open positions</h2>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/apply/${job.id}`}
                  className="card block cursor-pointer hover:border-[var(--text)] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 hidden md:block" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </Link>
              ))}
            </div>

            {jobs.length === 0 && (
              <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
                No open positions at the moment. Check back soon!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4">Don't see a perfect fit?</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              We're always looking for exceptional talent. Send us your resume and we'll reach out when the right opportunity opens up.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

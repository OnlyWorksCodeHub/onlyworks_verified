'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: {
        sitekey: string
        callback: (token: string) => void
        'expired-callback'?: () => void
        'error-callback'?: () => void
        theme?: 'light' | 'dark' | 'auto'
      }) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
}

const jobs: Record<string, Job> = {
  'marketing-intern': {
    id: 'marketing-intern',
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Remote',
    type: 'Internship',
    description: 'We\'re looking for a creative and driven Marketing Intern to join our growing team. You\'ll work closely with our marketing team to help build brand awareness, create engaging content, and support various marketing initiatives. This is a great opportunity to gain hands-on experience in a fast-paced startup environment.',
    responsibilities: [
      'Assist in creating and scheduling social media content across platforms',
      'Help write blog posts, newsletters, and marketing copy',
      'Support the planning and execution of marketing campaigns',
      'Conduct market research and competitor analysis',
      'Help manage and update our website content',
      'Assist with email marketing campaigns',
      'Track and report on marketing metrics'
    ],
    requirements: [
      'Currently pursuing or recently completed a degree in Marketing, Communications, or related field',
      'Strong written and verbal communication skills',
      'Familiarity with social media platforms (LinkedIn, Twitter, Instagram)',
      'Basic understanding of digital marketing concepts',
      'Self-motivated with ability to work independently',
      'Creative mindset with attention to detail',
      'Experience with Canva, Figma, or similar design tools is a plus'
    ],
    benefits: [
      'Flexible remote work schedule',
      'Mentorship from experienced marketing professionals',
      'Opportunity to work on real projects with tangible impact',
      'Potential for full-time conversion based on performance',
      'Stipend provided',
      'Access to learning resources and courses'
    ]
  },
  'product-marketing-manager': {
    id: 'product-marketing-manager',
    title: 'Product Marketing Manager',
    department: 'Product Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Drive go-to-market strategy for our product launches. Own positioning, messaging, and competitive analysis to help OnlyWorks stand out in the market.',
    responsibilities: [
      'Develop and execute go-to-market strategies for product launches',
      'Create compelling positioning and messaging frameworks',
      'Conduct competitive analysis and market research',
      'Collaborate with product and sales teams on enablement materials',
      'Lead product launches and coordinate cross-functional teams',
      'Develop case studies and customer success stories',
      'Track and analyze product marketing metrics'
    ],
    requirements: [
      '4+ years of product marketing experience in B2B SaaS',
      'Experience launching products and driving adoption',
      'Strong analytical and storytelling skills',
      'Ability to translate technical features into customer benefits',
      'Excellent cross-functional collaboration skills',
      'Experience with marketing automation tools'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Flexible remote work',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Learning and development budget',
      'Home office stipend'
    ]
  },
  'market-research-analyst': {
    id: 'market-research-analyst',
    title: 'Market Research Analyst',
    department: 'Research',
    location: 'Remote',
    type: 'Full-time',
    description: 'Lead market research initiatives to uncover customer insights, competitive intelligence, and market trends that inform our product and marketing strategies.',
    responsibilities: [
      'Design and conduct qualitative and quantitative research studies',
      'Analyze market trends and competitive landscape',
      'Create customer personas and journey maps',
      'Present insights and recommendations to stakeholders',
      'Build and maintain competitive intelligence databases',
      'Partner with product and marketing teams on strategic initiatives',
      'Track industry trends and emerging technologies'
    ],
    requirements: [
      '3+ years of market research experience',
      'Proficiency in qualitative and quantitative research methods',
      'Experience with survey tools and data analysis',
      'Strong presentation and reporting skills',
      'Excellent analytical and critical thinking abilities',
      'Experience with research tools like Qualtrics, SurveyMonkey'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Flexible remote work',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Learning and development budget',
      'Home office stipend'
    ]
  },
  'sales-development-rep': {
    id: 'sales-development-rep',
    title: 'Sales Development Representative',
    department: 'Sales',
    location: 'Remote',
    type: 'Full-time',
    description: 'Be the first point of contact for potential customers. Generate and qualify leads through outbound prospecting and inbound lead follow-up.',
    responsibilities: [
      'Conduct outbound prospecting via email, phone, and social media',
      'Qualify inbound leads and schedule demos for account executives',
      'Research target accounts and identify key decision makers',
      'Maintain accurate records in CRM system',
      'Collaborate with marketing on lead generation campaigns',
      'Meet and exceed monthly qualified meeting goals',
      'Provide feedback on lead quality and market trends'
    ],
    requirements: [
      '1-2 years of sales or customer-facing experience',
      'Excellent communication and interpersonal skills',
      'Self-starter mentality with a hunger to learn',
      'Experience with CRM tools like Salesforce or HubSpot',
      'Resilience and ability to handle rejection',
      'Strong organizational and time management skills'
    ],
    benefits: [
      'Competitive base salary plus commission',
      'Flexible remote work',
      'Health, dental, and vision insurance',
      'Career growth opportunities',
      'Sales training and mentorship',
      'Team bonuses and incentives'
    ]
  },
  'content-marketing-manager': {
    id: 'content-marketing-manager',
    title: 'Content Marketing Manager',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create compelling content that educates and engages our target audience. Own our blog, case studies, whitepapers, and thought leadership content.',
    responsibilities: [
      'Develop and execute content strategy aligned with business goals',
      'Write and edit blog posts, whitepapers, and case studies',
      'Manage content calendar and publication schedule',
      'Optimize content for SEO and organic growth',
      'Collaborate with subject matter experts on thought leadership',
      'Analyze content performance and iterate based on data',
      'Manage freelance writers and content contributors'
    ],
    requirements: [
      '4+ years of content marketing experience',
      'Exceptional writing and editing skills',
      'Experience with SEO and content analytics',
      'Ability to distill complex topics into accessible content',
      'Experience with content management systems',
      'Portfolio of published B2B content'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Flexible remote work',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Learning and development budget',
      'Home office stipend'
    ]
  },
  'growth-marketing-manager': {
    id: 'growth-marketing-manager',
    title: 'Growth Marketing Manager',
    department: 'Growth',
    location: 'Remote',
    type: 'Full-time',
    description: 'Own and optimize our paid acquisition channels. Design and execute experiments to drive efficient customer acquisition and conversion.',
    responsibilities: [
      'Manage and optimize paid advertising campaigns across channels',
      'Design and run A/B tests to improve conversion rates',
      'Analyze campaign performance and report on key metrics',
      'Develop landing pages and conversion funnels',
      'Collaborate with product on growth experiments',
      'Manage marketing budget and forecast performance',
      'Stay current on digital marketing trends and best practices'
    ],
    requirements: [
      '3+ years of growth or performance marketing experience',
      'Hands-on experience with Google Ads, LinkedIn, and Meta',
      'Strong analytical skills and data-driven mindset',
      'Experience with A/B testing and CRO',
      'Proficiency with analytics tools like Google Analytics, Mixpanel',
      'Experience with marketing automation platforms'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Flexible remote work',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Learning and development budget',
      'Home office stipend'
    ]
  },
  'brand-marketing-manager': {
    id: 'brand-marketing-manager',
    title: 'Brand Marketing Manager',
    department: 'Brand',
    location: 'Remote',
    type: 'Full-time',
    description: 'Shape and evolve the OnlyWorks brand. Lead creative campaigns, manage brand guidelines, and ensure consistent messaging across all touchpoints.',
    responsibilities: [
      'Develop and maintain brand guidelines and visual identity',
      'Lead creative campaigns that build brand awareness',
      'Manage relationships with creative agencies and freelancers',
      'Ensure brand consistency across all marketing channels',
      'Conduct brand research and track brand health metrics',
      'Collaborate on product naming and messaging',
      'Oversee production of brand assets and collateral'
    ],
    requirements: [
      '5+ years of brand marketing experience',
      'Strong creative vision and design sensibility',
      'Experience managing agencies and creative teams',
      'Track record of building memorable brand campaigns',
      'Excellent project management abilities',
      'Experience with brand strategy and positioning'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Flexible remote work',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Learning and development budget',
      'Home office stipend'
    ]
  },
  'partnerships-manager': {
    id: 'partnerships-manager',
    title: 'Partnerships Manager',
    department: 'Partnerships',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and manage strategic partnerships that expand our reach and add value for customers. Identify, negotiate, and execute partnership opportunities.',
    responsibilities: [
      'Identify and evaluate potential partnership opportunities',
      'Develop partnership proposals and negotiate agreements',
      'Manage ongoing partner relationships and joint initiatives',
      'Collaborate with product on integration partnerships',
      'Track partnership performance and ROI',
      'Represent OnlyWorks at industry events and conferences',
      'Build and maintain partner communication and enablement materials'
    ],
    requirements: [
      '4+ years of business development or partnerships experience',
      'Strong negotiation and relationship-building skills',
      'Experience structuring and executing partnership deals',
      'Excellent project management abilities',
      'Strategic thinking and business acumen',
      'Experience in B2B SaaS or technology partnerships'
    ],
    benefits: [
      'Competitive salary and equity package',
      'Flexible remote work',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Learning and development budget',
      'Home office stipend'
    ]
  }
}

export default function ApplyPage() {
  const params = useParams()
  const jobId = params.jobId as string
  const job = jobs[jobId]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverLetter: ''
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const renderTurnstile = () => {
      if (turnstileRef.current && window.turnstile && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(null),
          'error-callback': () => {
            setTurnstileToken(null)
            toast.error('Verification failed. Please try again.')
          },
          theme: 'light'
        })
      }
    }

    // Check if script already exists and is loaded
    const existingScript = document.getElementById('turnstile-script')
    if (existingScript && window.turnstile) {
      renderTurnstile()
      return
    }

    // Load the script if it doesn't exist
    if (!existingScript) {
      const script = document.createElement('script')
      script.id = 'turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.onload = () => {
        // Wait a tick for turnstile to initialize
        setTimeout(renderTurnstile, 0)
      }
      document.head.appendChild(script)
    } else {
      // Script exists but not loaded yet, poll for it
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval)
          renderTurnstile()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [])

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff' }}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Job not found</h1>
          <Link href="/careers" className="text-sm" style={{ color: '#0064e0' }}>
            ← Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!turnstileToken) {
      toast.error('Please complete the verification')
      return
    }

    if (!resumeFile) {
      toast.error('Please upload your resume')
      return
    }

    setIsLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('jobId', job.id)
      submitData.append('jobTitle', job.title)
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('linkedin', formData.linkedin)
      submitData.append('portfolio', formData.portfolio)
      submitData.append('coverLetter', formData.coverLetter)
      submitData.append('turnstileToken', turnstileToken)
      submitData.append('resume', resumeFile)

      const res = await fetch('/api/job-applications', {
        method: 'POST',
        body: submitData
      })

      if (!res.ok) {
        let errorMessage = 'Failed to submit application'
        try {
          const data = await res.json()
          errorMessage = data.error || errorMessage
        } catch {
          // Response was not JSON (e.g., "Forbidden")
          const text = await res.text().catch(() => '')
          if (text && text.length < 100) {
            errorMessage = text
          }
        }
        throw new Error(errorMessage)
      }

      setIsSubmitted(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ background: '#fff' }}>
        <Toaster position="top-center" />
        <header className="border-b" style={{ borderColor: '#e5e5e5' }}>
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/careers" className="inline-flex items-center gap-2 text-sm" style={{ color: '#525252' }}>
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#dcfce7' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#16a34a' }} />
          </div>
          <h1 className="text-3xl font-semibold mb-4" style={{ color: '#0a0a0a' }}>
            Application Submitted
          </h1>
          <p className="text-lg mb-8" style={{ color: '#525252' }}>
            Thank you for applying for the {job.title} position. We'll review your application and get back to you within 5 business days.
          </p>
          <Link
            href="/careers"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium"
            style={{ background: '#0a0a0a', color: '#fff' }}
          >
            Back to Careers
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <Toaster position="top-center" />

      {/* Header */}
      <header className="border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm" style={{ color: '#525252' }}>
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Job Details - Left Side */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="mb-6">
                <span
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4"
                  style={{ background: '#f3f4f6', color: '#525252' }}
                >
                  {job.department}
                </span>
                <h1 className="text-2xl font-semibold mb-2" style={{ color: '#0a0a0a' }}>
                  {job.title}
                </h1>
                <p className="text-sm" style={{ color: '#525252' }}>
                  {job.location} · {job.type}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>About the Role</h3>
                  <p className="text-sm" style={{ color: '#525252', lineHeight: 1.6 }}>
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>Responsibilities</h3>
                  <ul className="space-y-1">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: '#525252' }}>
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>Requirements</h3>
                  <ul className="space-y-1">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: '#525252' }}>
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#0a0a0a' }}>What We Offer</h3>
                  <ul className="space-y-1">
                    {job.benefits.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: '#525252' }}>
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form - Right Side */}
          <div className="lg:col-span-3">
            <div className="rounded-xl p-8" style={{ background: '#fafafa', border: '1px solid #e5e5e5' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: '#0a0a0a' }}>
                Submit Your Application
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                      placeholder="yourportfolio.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    Resume *
                  </label>
                  <div
                    className="relative rounded-lg p-6 text-center cursor-pointer transition-colors hover:bg-white"
                    style={{ border: '2px dashed #e5e5e5', background: '#fff' }}
                    onClick={() => document.getElementById('resume-input')?.click()}
                  >
                    <input
                      id="resume-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#a3a3a3' }} />
                    {resumeFile ? (
                      <p className="text-sm font-medium" style={{ color: '#0a0a0a' }}>{resumeFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium" style={{ color: '#0a0a0a' }}>
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#a3a3a3' }}>
                          PDF or Word (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0a0a0a' }}>
                    Cover Letter
                  </label>
                  <textarea
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                    style={{ border: '1px solid #e5e5e5', background: '#fff' }}
                    placeholder="Tell us why you're interested in this internship and what makes you a great fit..."
                  />
                </div>

                {/* Turnstile */}
                <div className="flex justify-center py-2">
                  <div ref={turnstileRef}></div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !turnstileToken}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#0a0a0a', color: '#fff' }}
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>

                <p className="text-xs text-center" style={{ color: '#a3a3a3' }}>
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" style={{ color: '#0064e0' }}>Privacy Policy</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

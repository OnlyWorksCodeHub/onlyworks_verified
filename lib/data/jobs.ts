export interface Job {
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

export const jobs: Job[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
]

export function findJobById(id: string): Job | undefined {
  return jobs.find(j => j.id === id)
}

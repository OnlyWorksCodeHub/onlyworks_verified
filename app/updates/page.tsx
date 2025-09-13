import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Footer } from '@/components/layout/Footer'

export default function UpdatesPage() {
  const updates = [
    {
      date: "January 15, 2025",
      title: "Enhanced AI Detection Accuracy",
      image: "/images/ai-update.jpg",
      description: "We've significantly improved our AI algorithms for detecting automation and work patterns, achieving 98.5% accuracy in distinguishing genuine work from automated processes.",
      improvements: [
        "Advanced machine learning models for better pattern recognition",
        "Reduced false positive rates by 35%",
        "Enhanced detection of sophisticated automation tools",
        "Improved real-time analysis performance"
      ],
      fixes: [
        "Fixed occasional lag in live tracking dashboard",
        "Resolved screenshot quality issues on high-DPI displays",
        "Corrected timezone handling in report generation"
      ]
    },
    {
      date: "December 20, 2024",
      title: "Team Dashboard Redesign",
      image: "/images/dashboard-redesign.jpg",
      description: "Complete overhaul of the team dashboard with improved user experience, better data visualization, and faster load times.",
      improvements: [
        "New intuitive interface with modern design patterns",
        "Interactive charts and real-time productivity metrics",
        "Customizable widgets for different team roles",
        "Mobile-responsive design for on-the-go management",
        "Advanced filtering and search capabilities"
      ],
      fixes: [
        "Fixed data export functionality for large datasets",
        "Resolved memory leak issues in long-running sessions",
        "Corrected permission handling for team managers"
      ]
    },
    {
      date: "November 30, 2024",
      title: "Privacy & Security Enhancements",
      image: "/images/security-update.jpg",
      description: "Major security improvements and enhanced privacy controls to ensure your work data remains completely secure and under your control.",
      improvements: [
        "End-to-end encryption for all data transmission",
        "Enhanced user consent management system",
        "Granular privacy controls for individual users",
        "SOC 2 Type II compliance certification",
        "Advanced audit logging and monitoring"
      ],
      fixes: [
        "Strengthened password requirements and 2FA implementation",
        "Fixed potential data exposure in API responses",
        "Resolved session timeout issues"
      ]
    },
    {
      date: "October 15, 2024",
      title: "Public API Launch",
      image: "/images/api-launch.jpg",
      description: "Introducing our comprehensive REST API, allowing seamless integration with your existing tools and workflows.",
      improvements: [
        "Full REST API with comprehensive documentation",
        "SDK support for popular programming languages",
        "Webhook notifications for real-time updates",
        "Rate limiting and authentication best practices",
        "Interactive API documentation and testing tools"
      ],
      fixes: [
        "Initial release - no fixes in this version"
      ]
    }
  ]

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
                <Link href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">Careers</Link>
                <Link href="/updates" className="text-primary hover:text-primary-dark text-sm font-medium">Updates</Link>
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
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6">
            Product Updates & <span className="text-primary">Insights</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay up to date with the latest OnlyWorks features, improvements, and insights
            from our team. See what we're building and where we're headed.
          </p>
        </div>
      </section>

      {/* Updates Timeline */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {updates.map((update, index) => (
              <article key={index} className="group">
                <div className="mb-6">
                  <time className="text-sm font-medium text-primary">{update.date}</time>
                  <h2 className="text-3xl font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors cursor-pointer">
                    {update.title}
                  </h2>
                </div>

                <div className="bg-gray-100 rounded-xl aspect-video mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Featured image placeholder</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  {update.description}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvements</h3>
                    <ul className="space-y-2">
                      {update.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fixes</h3>
                    <ul className="space-y-2">
                      {update.fixes.map((fix, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm">{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Stay in the loop</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get notified about new features, improvements, and insights delivered to your inbox.
          </p>
          <div className="flex items-center justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="px-6 py-2.5 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
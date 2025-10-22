import { notFound } from 'next/navigation'
  import { supabaseServer, type SharedReport } from '@/lib/supabase-server'
  import SharedReportClient from './SharedReportClient'
  import SharedReportNavigation from './SharedReportNavigation'
  import { FileText, Code, Activity, TrendingUp, Lock, Calendar, Clock } from 'lucide-react'

  export const runtime = 'nodejs'
  export const dynamic = 'force-dynamic'

  interface ReportPageProps {
    params: {
      token: string
    }
  }

  async function getReportMetadata(token: string): Promise<SharedReport | null> {
    const { data: report, error } = await supabaseServer
      .from('shared_reports')
      .select('*')
      .eq('token', token)
      .single<SharedReport>()

    if (error || !report) {
      return null
    }

    return report
  }

  export default async function ReportPage({ params }: ReportPageProps) {
    const { token } = params
    const report = await getReportMetadata(token)

    if (!report) {
      notFound()
    }

    const isExpired = report.expires_at && new Date(report.expires_at) < new Date()
    if (isExpired) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="text-6xl mb-6">⏰</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">Link Expired</h1>
            <p className="text-gray-600 mb-2">
              This report link expired on{' '}
              <strong className="text-gray-900">
                {new Date(report.expires_at!).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </p>
            <p className="text-sm text-gray-500">
              Please contact the report owner to request a new link.
            </p>
          </div>
        </div>
      )
    }

    if (report.is_revoked) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">Access Revoked</h1>
            <p className="text-gray-600 mb-2">
              This report link has been disabled by the owner.
            </p>
            <p className="text-sm text-gray-500">
              If you believe this is an error, please contact the report owner.
            </p>
          </div>
        </div>
      )
    }

    // Calculate stats from report metadata
    const totalReports = 1
    const linesWritten = report.metadata?.lines_written || 0
    const filesModified = report.metadata?.files_modified || 0
    const avgLines = linesWritten

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <SharedReportNavigation token={token} />

        {/* Main Content */}
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Locked Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <LockedStatCard
                title="Total Reports"
                value={totalReports}
                icon={<FileText className="w-8 h-8 text-[#5c5ce6]" />}
              />
              <LockedStatCard
                title="Lines Written"
                value={linesWritten.toLocaleString()}
                icon={<Code className="w-8 h-8 text-[#5c5ce6]" />}
              />
              <LockedStatCard
                title="Files Modified"
                value={filesModified}
                icon={<Activity className="w-8 h-8 text-[#5c5ce6]" />}
              />
              <LockedStatCard
                title="Avg Lines/Report"
                value={avgLines}
                icon={<TrendingUp className="w-8 h-8 text-[#5c5ce6]" />}
              />
            </div>

            {/* Recent Reports Section */}
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {report.title || 'Development Report'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {report.metadata?.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {report.metadata.duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Code className="w-3 h-3" />
                        {linesWritten} lines
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {filesModified} files
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-[#5c5ce6] text-white text-sm rounded-lg">
                    View
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <ReportContent token={token} />
            </div>

            {/* Locked Analytics Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <LockedAnalyticsSection
                title="📈 Productivity Trends"
                description="Compare reports and track progress over time"
              />
              <LockedAnalyticsSection
                title="📊 Advanced Analytics"
                description="Deep-dive into performance metrics and insights"
              />
              <LockedAnalyticsSection
                title="⚡ AI-Powered Insights"
                description="Get personalized recommendations and analysis"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 py-8 px-6 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 mb-2">
              Powered by <span className="font-semibold text-[#5c5ce6]">OnlyWorks</span>
            </p>
            <p className="text-sm text-gray-500">
              This report will expire on{' '}
              {new Date(report.expires_at!).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Client-side Modal & Floating Button */}
        <SharedReportClient token={token} />
      </div>
    )
  }

  function ReportContent({ token }: { token: string }) {
    return (
      <iframe
        src={`/api/report/${token}`}
        className="w-full border-0"
        style={{ minHeight: 'calc(100vh - 200px)' }}
        title="Report Content"
        sandbox="allow-same-origin allow-scripts"
      />
    )
  }

  function LockedStatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border relative overflow-hidden">
        {/* Lock Overlay */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 cursor-pointer hover:bg-white/70 transition-colors group">
          <div className="text-center">
            <Lock className="w-6 h-6 text-[#5c5ce6] mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs text-gray-600 font-medium">Sign in to unlock</p>
          </div>
        </div>

        {/* Card Content (blurred) */}
        <div className="flex items-center justify-between blur-sm">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          {icon}
        </div>
      </div>
    )
  }

  function LockedAnalyticsSection({ title, description }: { title: string; description: string }) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border relative overflow-hidden min-h-[200px]">
        {/* Lock Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5c5ce6]/10 to-purple-100/50 backdrop-blur-sm flex items-center justify-center z-10 cursor-pointer hover:from-[#5c5ce6]/20 hover:to-purple-100/70 transition-all group">
          <div className="text-center p-6">
            <Lock className="w-8 h-8 text-[#5c5ce6] mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-700 font-medium mb-1">Sign in to unlock</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>

        {/* Section Content (placeholder) */}
        <div className="blur-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  export async function generateMetadata({ params }: ReportPageProps) {
    const report = await getReportMetadata(params.token)

    if (!report) {
      return {
        title: 'Report Not Found',
      }
    }

    return {
      title: report.title || 'Development Report',
      description: `Report from ${report.metadata?.developer || 'OnlyWorks'}`,
      robots: 'noindex, nofollow',
    }
  }

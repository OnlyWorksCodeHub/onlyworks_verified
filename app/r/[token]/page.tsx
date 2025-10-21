import { notFound } from 'next/navigation'
  import { supabaseServer, type SharedReport } from '@/lib/supabase-server'

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

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                  {report.title || 'Development Report'}
                </h1>
                <p className="text-gray-600">
                  {report.metadata?.developer && `${report.metadata.developer} • `}
                  {new Date(report.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg mb-2">
                  <span className="text-sm text-gray-600">
                    Expires: {new Date(report.expires_at!).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {report.view_count || 0} {report.view_count === 1 ? 'view' : 'views'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="max-w-7xl mx-auto">
          <ReportContent token={token} />
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 py-8 px-6 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 mb-2">
              Powered by <span className="font-semibold text-gray-900">OnlyWorks</span>
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

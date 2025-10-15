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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
            <p className="text-gray-600 mb-4">
              This report link expired on{' '}
              <strong>
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Revoked</h1>
            <p className="text-gray-600 mb-4">
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
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 px-4 
  shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {report.title || 'Development Report'}
                </h1>
                <p className="text-purple-100 text-sm">
                  {report.metadata?.developer && `From ${report.metadata.developer} • `}
                  {new Date(report.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="text-purple-100">
                  Expires: {new Date(report.expires_at!).toLocaleDateString()}
                </p>
                <p className="text-purple-200 text-xs mt-1">
                  Views: {report.view_count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <ReportContent token={token} />
        </div>

        <div className="bg-gray-50 border-t border-gray-200 py-6 px-4 mt-8">
          <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
            <p>
              Powered by <strong className="text-purple-600">OnlyWorks</strong>
            </p>
            <p className="text-xs text-gray-500 mt-1">
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

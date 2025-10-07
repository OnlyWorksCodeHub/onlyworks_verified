'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Mail, Calendar, Code, FileText, Camera, Clock } from 'lucide-react'

export default function EmailPreviewPage() {
  const { token } = useParams()

  const sampleReport = {
    title: "Last 24 Hours Report",
    report_date: "2025-10-03",
    lines_written: 0,
    files_modified_count: 0,
    session_duration: "Approximately 13 minutes",
    screenshot_count: 341,
    executive_summary: "The developer's session primarily involves managing a LinkedIn company page for OnlyWorks. They are observed inviting connections, particularly focusing on individuals with ties to Stony Brook University. There's evidence of video editing using Veed.io and email management through Outlook..."
  }

  const shareLink = `http://localhost:3000/shared/${token}`
  const senderName = "brodeywang2004"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">📧 Email Preview</h1>
            <Link
              href={shareLink}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Actual Report
            </Link>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Email Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Email Preview</h2>
                <p className="text-sm text-gray-600">This is what the recipient would receive</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div><strong>To:</strong> recipient@example.com</div>
              <div><strong>From:</strong> brodeywang2004@gmail.com</div>
              <div><strong>Subject:</strong> 📊 {senderName} shared a work report with you - OnlyWorks</div>
            </div>
          </div>

          {/* Email Body Preview */}
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
              <h1 className="text-2xl font-bold mb-2">📊 OnlyWorks</h1>
              <p className="text-blue-100">A work report has been shared with you</p>
            </div>

            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Hello!</h3>

              <p className="mb-6">
                <strong>{senderName}</strong> has shared a work report with you from OnlyWorks.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Report: {sampleReport.title}
                </h4>
                <p className="text-gray-600 mb-4">
                  📅 {new Date(sampleReport.report_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded">
                    <Code className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="font-bold text-xl">{sampleReport.lines_written}</div>
                    <div className="text-xs text-gray-600">Lines Written</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <FileText className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="font-bold text-xl">{sampleReport.files_modified_count}</div>
                    <div className="text-xs text-gray-600">Files Modified</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <Clock className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                    <div className="font-bold text-sm">{sampleReport.session_duration}</div>
                    <div className="text-xs text-gray-600">Session Duration</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <Camera className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="font-bold text-xl">{sampleReport.screenshot_count}</div>
                    <div className="text-xs text-gray-600">Screenshots</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Executive Summary</h5>
                  <p className="text-gray-700 text-sm italic">
                    "{sampleReport.executive_summary.substring(0, 300)}..."
                  </p>
                </div>
              </div>

              <div className="text-center mb-6">
                <Link
                  href={shareLink}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  📖 View Full Report
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-medium">⏰ Access Expires:</p>
                <p className="text-yellow-700 text-sm">This link will expire on {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 font-medium">🔒 Security Notice:</p>
                <p className="text-blue-700 text-sm">This link is unique to you and should not be shared with others. If you didn't expect this email, you can safely ignore it.</p>
              </div>

              <hr className="my-6" />

              <div className="text-center text-gray-600">
                <p className="mb-2">Want to track your own productivity?</p>
                <Link href="http://localhost:3000" className="text-blue-600 hover:text-blue-700 font-medium">
                  Get OnlyWorks
                </Link>
              </div>

              <div className="text-center text-gray-500 text-sm mt-6">
                <p>This email was sent by OnlyWorks</p>
                <p>OnlyWorks - Productivity Tracking Made Simple</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={shareLink}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            🚀 Test the Actual Shared Report Page
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
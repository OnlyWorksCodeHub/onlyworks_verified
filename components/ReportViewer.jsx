import React, { useState } from 'react'
import { Share2, Download, Calendar, Clock, Code, FileText, AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react'
import ShareReportControls from './ShareReportControls'

const ReportViewer = ({ report, isShared = false }) => {
  const [activeTab, setActiveTab] = useState('overview')

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Report not found</h2>
          <p className="text-gray-500">This report may have been deleted or you don't have permission to view it.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'technical', label: 'Technical Details', icon: Code },
    { id: 'analysis', label: 'Analysis', icon: FileText }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{report.title || 'Daily Work Report'}</h1>
            <div className="flex items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{report.developer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(report.report_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{report.session_duration}</span>
              </div>
            </div>
          </div>
          {!isShared && (
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Executive Summary */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Executive Summary</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">{report.executive_summary}</p>
            </div>
          </section>

          {/* Key Metrics */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Lines Written</p>
                    <p className="text-2xl font-bold text-green-700">{report.lines_written || 0}</p>
                  </div>
                  <Code className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Files Modified</p>
                    <p className="text-2xl font-bold text-blue-700">{report.files_modified_count || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Screenshots</p>
                    <p className="text-2xl font-bold text-purple-700">{report.screenshot_count || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 uppercase tracking-wide">Errors</p>
                    <p className="text-2xl font-bold text-red-700">{report.errors_encountered_count || 0}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </section>

          {/* Completed Work */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Completed Work</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {report.completed_work && report.completed_work.length > 0 ? (
                <ul className="space-y-3">
                  {report.completed_work.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No completed work recorded</p>
              )}
            </div>
          </section>

          {/* Work In Progress */}
          {report.work_in_progress && report.work_in_progress.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Work In Progress</h2>
              <div className="space-y-4">
                {report.work_in_progress.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-2">{item.task}</h3>
                    <p className="text-gray-600 mb-3">{item.details}</p>
                    <p className="text-sm text-gray-500">
                      <strong>Evidence:</strong> {item.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Blockers */}
          {report.blockers && report.blockers.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blockers</h2>
              <div className="space-y-4">
                {report.blockers.map((blocker, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-semibold text-red-800 mb-2">{blocker.issue}</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong className="text-red-700">Evidence:</strong> <span className="text-red-600">{blocker.evidence}</span></p>
                      <p><strong className="text-red-700">Impact:</strong> <span className="text-red-600">{blocker.impact}</span></p>
                      <p><strong className="text-red-700">Response:</strong> <span className="text-red-600">{blocker.userResponse}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Activity Timeline</h2>
          {report.full_report_data?.detailedActivityTimeline && report.full_report_data.detailedActivityTimeline.length > 0 ? (
            <div className="space-y-4">
              {report.full_report_data.detailedActivityTimeline.map((item, index) => (
                <div key={index} className="flex gap-4 p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-sm font-mono text-gray-500 min-w-20 mt-1">
                    {item.estimatedTime}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{item.applicationInFocus}</h4>
                      {item.windowTitle && (
                        <span className="text-sm text-gray-500">• {item.windowTitle}</span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{item.activity}</p>

                    {item.filesWorked && item.filesWorked.length > 0 && (
                      <div className="mb-2">
                        <strong className="text-sm text-gray-600">Files: </strong>
                        <span className="text-sm text-gray-700">{item.filesWorked.join(', ')}</span>
                      </div>
                    )}

                    {item.browserUrls && item.browserUrls.length > 0 && (
                      <div className="mb-2">
                        <strong className="text-sm text-gray-600">URLs: </strong>
                        <span className="text-sm text-gray-700">{item.browserUrls.join(', ')}</span>
                      </div>
                    )}

                    {item.errors && item.errors.length > 0 && (
                      <div className="mb-2">
                        <strong className="text-sm text-red-600">Errors: </strong>
                        <span className="text-sm text-red-700">{item.errors.join(', ')}</span>
                      </div>
                    )}

                    {item.keyObservations && (
                      <p className="text-sm italic text-gray-600 mt-2">{item.keyObservations}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No detailed timeline available for this report</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'technical' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Technical Details</h2>

          {report.technical_details ? (
            <div className="grid md:grid-cols-2 gap-6">
              {report.technical_details.filesModified && report.technical_details.filesModified.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Files Modified</h3>
                  <ul className="space-y-2">
                    {report.technical_details.filesModified.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded">
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.technical_details.toolsUsed && report.technical_details.toolsUsed.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Tools Used</h3>
                  <ul className="space-y-2">
                    {report.technical_details.toolsUsed.map((tool, index) => (
                      <li key={index} className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.technical_details.gitActivity && report.technical_details.gitActivity.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
                  <h3 className="font-semibold text-gray-800 mb-4">Git Activity</h3>
                  <ul className="space-y-2">
                    {report.technical_details.gitActivity.map((activity, index) => (
                      <li key={index} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No technical details available for this report</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Productivity Analysis</h2>

          {/* Productivity Assessment */}
          {report.productivity_assessment && (
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Assessment</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(report.productivity_assessment).map(([key, value]) => (
                  <div key={key} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-800 capitalize mb-2">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h4>
                    <p className="text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-8">
            {report.strengths_observed && report.strengths_observed.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Strengths Observed</h3>
                <div className="space-y-4">
                  {report.strengths_observed.map((strength, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">{strength.strength}</h4>
                      <p className="text-sm text-green-700 mb-2">
                        <strong>Evidence:</strong> {strength.evidence}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Impact:</strong> {strength.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {report.weaknesses_identified && report.weaknesses_identified.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Areas for Improvement</h3>
                <div className="space-y-4">
                  {report.weaknesses_identified.map((weakness, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-800 mb-2">{weakness.weakness}</h4>
                      <p className="text-sm text-orange-700 mb-2">
                        <strong>Evidence:</strong> {weakness.evidence}
                      </p>
                      <p className="text-sm text-orange-700 mb-2">
                        <strong>Impact:</strong> {weakness.impact}
                      </p>
                      <p className="text-sm text-orange-700">
                        <strong>Suggestion:</strong> {weakness.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Next Steps */}
          {report.next_steps && report.next_steps.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Next Steps</h3>
              <div className="space-y-4">
                {report.next_steps.map((step, index) => (
                  <div key={index} className={`border rounded-lg p-6 ${
                    step.priority === 'high' ? 'bg-red-50 border-red-200' :
                    step.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{step.recommendation}</h4>
                        <p className="text-gray-600">{step.rationale}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        step.priority === 'high' ? 'bg-red-100 text-red-800' :
                        step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {step.priority} priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Share Controls (only for authenticated users, not shared view) */}
      {!isShared && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <ShareReportControls reportId={report.id} currentlyShared={!!report.shared_at} />
        </div>
      )}

      {/* Footer for shared reports */}
      {isShared && (
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            This report was shared from OnlyWorks • Views: {report.view_count || 0}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Generated on {formatDate(report.created_at)} at {formatTime(report.created_at)}
          </p>
        </div>
      )}
    </div>
  )
}

export default ReportViewer
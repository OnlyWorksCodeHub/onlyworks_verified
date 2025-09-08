'use client'

import { CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react'

interface SessionFeedbackProps {
  summary: any
}

export function SessionFeedback({ summary }: SessionFeedbackProps) {
  return (
    <div className="space-y-4">
      {/* Strengths */}
      {summary.strengths && summary.strengths.length > 0 && (
        <div className="card-clean p-6">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              What You Did Well
            </h3>
          </div>
          <ul className="space-y-2">
            {summary.strengths.map((strength: string, index: number) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                • {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {summary.improvements && summary.improvements.length > 0 && (
        <div className="card-clean p-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Areas to Improve
            </h3>
          </div>
          <ul className="space-y-2">
            {summary.improvements.map((improvement: string, index: number) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                • {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specific Issues */}
      {summary.specific_issues && summary.specific_issues.length > 0 && (
        <div className="card-clean p-6 border-l-4 border-amber-500">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Specific Issues
            </h3>
          </div>
          <div className="space-y-3">
            {summary.specific_issues.map((issue: any, index: number) => (
              <div key={index}>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {issue.time}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {issue.description}
                </p>
                {issue.suggestion && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    💡 {issue.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {summary.recommendations && summary.recommendations.length > 0 && (
        <div className="card-clean p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-300">
              Next Session Goals
            </h3>
          </div>
          <ul className="space-y-2">
            {summary.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-sm text-blue-800 dark:text-blue-300">
                → {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

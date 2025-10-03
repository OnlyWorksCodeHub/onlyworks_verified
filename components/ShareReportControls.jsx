import React from 'react'
import { Share2, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const ShareReportControls = ({ reportId, currentlyShared }) => {
  const handleDisabledAction = () => {
    toast.error('Sharing is currently disabled. Contact admin to enable this feature.')
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-300">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-600">Share Report</h3>
        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">Disabled</span>
      </div>

      <div className="space-y-4">
        <p className="text-gray-500">
          Report sharing is currently disabled. Contact your administrator to enable this feature.
        </p>

        <button
          onClick={handleDisabledAction}
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed opacity-60"
        >
          <Share2 className="w-4 h-4" />
          Create Share Link
        </button>
      </div>

      <div className="mt-4 p-3 bg-orange-100 rounded-md">
        <p className="text-sm text-orange-800">
          <strong>Feature Unavailable:</strong> Sharing functionality requires additional database setup.
          Contact your system administrator to enable report sharing.
        </p>
      </div>
    </div>
  )
}

export default ShareReportControls
import React, { useState, useEffect } from 'react'
import { Share2, Mail, Clock, Eye, Trash2, Copy, Check, AlertCircle, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

const ShareReportControls = ({ reportId, currentlyShared }) => {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [expiresInDays, setExpiresInDays] = useState(30)
  const [isSharing, setIsSharing] = useState(false)
  const [sharedReports, setSharedReports] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedToken, setCopiedToken] = useState(null)

  useEffect(() => {
    loadSharedReports()
  }, [reportId])

  const loadSharedReports = async () => {
    if (!reportId) return

    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return


      const response = await fetch('/api/reports/share-email', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Filter for current report
        const currentReportShares = data.sharedReports?.filter(
          share => share.reports.id === reportId
        ) || []
        setSharedReports(currentReportShares)
      }
    } catch (error) {
      console.error('Failed to load shared reports:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareViaEmail = async (e) => {
    e.preventDefault()

    if (!recipientEmail) {
      toast.error('Please enter a recipient email address')
      return
    }

    if (!reportId) {
      toast.error('No report ID provided')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSharing(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please log in to share reports')
        return
      }


      const response = await fetch('/api/reports/share-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reportId,
          recipientEmail,
          expiresInDays
        })
      })

      const result = await response.json()

      if (response.ok) {
        if (result.warning) {
          toast.success('Share created! ' + result.warning, { duration: 4000 })
        } else if (result.emailSent) {
          toast.success(`Report shared with ${recipientEmail}! Email notification sent.`)
        } else {
          toast.success('Share link created successfully!')
        }

        setRecipientEmail('')
        loadSharedReports() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to share report')
      }
    } catch (error) {
      console.error('Share error:', error)
      toast.error('Failed to share report. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleRevokeShare = async (shareId) => {
    if (!confirm('Are you sure you want to revoke this share? The recipient will no longer be able to access the report.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/reports/share-email?shareId=${shareId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        toast.success('Share revoked successfully')
        loadSharedReports()
      } else {
        const result = await response.json()
        toast.error(result.error || 'Failed to revoke share')
      }
    } catch (error) {
      console.error('Revoke error:', error)
      toast.error('Failed to revoke share')
    }
  }

  const copyShareLink = async (shareToken) => {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedToken(shareToken)
      toast.success('Share link copied to clipboard!')
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffMs = expiry - now
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'Expired'
    if (diffDays === 0) return 'Expires today'
    if (diffDays === 1) return 'Expires tomorrow'
    return `Expires in ${diffDays} days`
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Share2 className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Share Report</h3>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
      </div>

      {/* Share Form */}
      <form onSubmit={handleShareViaEmail} className="space-y-4 mb-6">
        <div>
          <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Email Address
          </label>
          <input
            type="email"
            id="recipientEmail"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSharing}
          />
        </div>

        <div>
          <label htmlFor="expiresInDays" className="block text-sm font-medium text-gray-700 mb-2">
            Link Expires In
          </label>
          <select
            id="expiresInDays"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSharing}
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days (recommended)</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSharing || !recipientEmail}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSharing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Send Share Link
            </>
          )}
        </button>
      </form>

      {/* Current Shares */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-500" />
          <h4 className="font-medium text-gray-900">Current Shares</h4>
          {sharedReports.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {sharedReports.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading shares...</p>
          </div>
        ) : sharedReports.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Share2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No shares yet</p>
            <p className="text-sm text-gray-400">Share this report with colleagues to see them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sharedReports.map((share) => (
              <div key={share.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{share.recipient_email}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeRemaining(share.expires_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {share.view_count || 0} views
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      Shared {formatDate(share.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => copyShareLink(share.share_token)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      title="Copy share link"
                    >
                      {copiedToken === share.share_token ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRevokeShare(share.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Revoke access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-blue-50 rounded-md">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Security & Privacy</p>
            <ul className="space-y-1 text-xs">
              <li>• Share links are unique and secure</li>
              <li>• Recipients don't need an OnlyWorks account</li>
              <li>• You can revoke access at any time</li>
              <li>• Links automatically expire after the set period</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareReportControls
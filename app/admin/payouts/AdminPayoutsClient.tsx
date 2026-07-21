'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Payout {
  id: string
  partner_id: string
  customer_id: string
  amount: number
  status: string
  subscription_date: string
  approval_date: string | null
  payout_date: string | null
  denial_reason: string | null
  notes: string | null
  created_at: string
  partner_name?: string
  customer_email?: string
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'paid' | 'denied' | 'all'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPayouts()
  }, [filter])

  const fetchPayouts = async () => {
    setLoading(true)
    try {
      const url = filter === 'all'
        ? '/api/admin/payouts'
        : `/api/admin/payouts?status=${filter}`

      const res = await fetch(url)
      const data = await res.json()

      if (data.success) {
        setPayouts(data.payouts)
      }
    } catch (error) {
      console.error('Failed to fetch payouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (payoutId: string) => {
    if (!confirm('Approve this payout?')) return

    setActionLoading(payoutId)
    try {
      const res = await fetch('/api/admin/payouts/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payout_id: payoutId })
      })

      const data = await res.json()

      if (data.success) {
        await fetchPayouts()
        toast.success('Payout approved!')
      } else {
        toast.error('Failed to approve: ' + data.error)
      }
    } catch (error) {
      toast.error('Error approving payout')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeny = async (payoutId: string) => {
    const reason = prompt('Enter denial reason:')
    if (!reason) return

    setActionLoading(payoutId)
    try {
      const res = await fetch('/api/admin/payouts/deny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payout_id: payoutId, reason })
      })

      const data = await res.json()

      if (data.success) {
        await fetchPayouts()
        toast.success('Payout denied')
      } else {
        toast.error('Failed to deny: ' + data.error)
      }
    } catch (error) {
      toast.error('Error denying payout')
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkPaid = async (payoutId: string) => {
    if (!confirm('Mark this payout as paid?')) return

    setActionLoading(payoutId)
    try {
      const res = await fetch('/api/admin/payouts/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payout_id: payoutId })
      })

      const data = await res.json()

      if (data.success) {
        await fetchPayouts()
        toast.success('Payout marked as paid!')
      } else {
        toast.error('Failed to mark as paid: ' + data.error)
      }
    } catch (error) {
      toast.error('Error marking payout as paid')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="pt-32 pb-16 px-4 md:px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1>Partner Payouts</h1>
            <Link href="/admin/partners" className="btn btn-secondary">
              Manage Partners
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {(['pending', 'approved', 'paid', 'denied', 'all'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
                  filter === status
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Payouts Table */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading payouts...</p>
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-12 card">
              <p className="text-gray-600">No {filter !== 'all' ? filter : ''} payouts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)' }}>
                    <th className="text-left px-4 py-2 text-sm font-medium">Partner</th>
                    <th className="text-left px-4 py-2 text-sm font-medium">Customer</th>
                    <th className="text-left px-4 py-2 text-sm font-medium">Amount</th>
                    <th className="text-left px-4 py-2 text-sm font-medium">Status</th>
                    <th className="text-left px-4 py-2 text-sm font-medium">Subscribed</th>
                    <th className="text-left px-4 py-2 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="card" style={{ marginBottom: '8px' }}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{payout.partner_name || payout.partner_id}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{payout.partner_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{payout.customer_email || 'N/A'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-green-600">${payout.amount.toFixed(2)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payout.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          payout.status === 'paid' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{formatDate(payout.subscription_date)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {payout.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(payout.id)}
                                disabled={actionLoading === payout.id}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeny(payout.id)}
                                disabled={actionLoading === payout.id}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                              >
                                Deny
                              </button>
                            </>
                          )}
                          {payout.status === 'approved' && (
                            <button
                              onClick={() => handleMarkPaid(payout.id)}
                              disabled={actionLoading === payout.id}
                              className="px-3 py-1 bg-violet-600 text-white rounded text-xs hover:bg-violet-700 disabled:opacity-50"
                            >
                              Mark Paid
                            </button>
                          )}
                          {payout.status === 'denied' && payout.denial_reason && (
                            <p className="text-xs text-red-600">{payout.denial_reason}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

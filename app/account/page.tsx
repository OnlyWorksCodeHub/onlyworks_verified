'use client'

import { useState } from 'react'
import { Loader2, CreditCard, Mail } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const openPortal = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to open portal')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to open subscription portal')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      <Toaster position="top-center" />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 mb-4">
              <CreditCard className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Manage Subscription</h1>
            <p className="text-gray-400">
              Update your payment method, view invoices, or cancel your subscription
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={openPortal} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your account email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the email you used to subscribe
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Opening Portal...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Open Billing Portal
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <h3 className="font-medium mb-2">What you can do in the billing portal:</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Update your payment method</li>
              <li>• View and download invoices</li>
              <li>• Cancel your subscription</li>
              <li>• Update billing information</li>
            </ul>
          </div>

          {/* Contact Support */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Need help?{' '}
            <a href="mailto:support@only-works.com" className="text-purple-400 hover:text-purple-300">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}

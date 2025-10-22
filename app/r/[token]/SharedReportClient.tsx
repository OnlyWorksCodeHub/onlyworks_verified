'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

interface SharedReportClientProps {
  token: string
}

export default function SharedReportClient({ token }: SharedReportClientProps) {
  const [showModal, setShowModal] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    // Check if modal has been shown this session
    const modalShown = sessionStorage.getItem('onlyworks_modal_shown')

    // Show floating button after 2 seconds for smooth entry
    const floatingTimer = setTimeout(() => {
      setShowFloatingButton(true)
    }, 2000)

    // Show modal after 20 seconds if not shown before
    if (!modalShown) {
      const modalTimer = setTimeout(() => {
        setShowModal(true)
        sessionStorage.setItem('onlyworks_modal_shown', 'true')
      }, 20000) // 20 seconds

      return () => {
        clearTimeout(modalTimer)
        clearTimeout(floatingTimer)
      }
    }

    return () => clearTimeout(floatingTimer)
  }, [])

  const closeModal = () => {
    setShowModal(false)
  }

  const openModal = () => {
    setShowModal(true)
  }

  return (
    <>
      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
            {/* Blue accent border */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-700" />

            <div className="p-8">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600/10 rounded-full">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
                Want to create your own verified reports?
              </h2>

              <p className="text-gray-600 text-center mb-6">
                Track YOUR productivity automatically with OnlyWorks
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Automatically track your productivity in real-time</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Get AI-powered insights on your work patterns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Share tamper-proof verified reports with anyone</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href="/auth/register"
                  className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/auth/login"
                  className="block w-full px-6 py-3 text-gray-700 text-center hover:bg-gray-50 transition-colors font-medium rounded-lg"
                >
                  Sign In
                </Link>
              </div>

              {/* Continue reading */}
              <button
                onClick={closeModal}
                className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continue Reading →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button (Always Visible) */}
      {showFloatingButton && (
        <button
          onClick={openModal}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 animate-slideInRight group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Create Your Own Reports</span>
        </button>
      )}
    </>
  )
}

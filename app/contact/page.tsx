'use client'

import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      toast.success('Message sent! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Main */}
      <section className="flex-1 pt-40 pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
            <div>
              <h1 className="mb-6">Get in touch</h1>
              <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                Questions about OnlyWorks? Want a demo? We'd love to hear from you.
              </p>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Email</p>
                  <p>admin@only-works.com</p>
                </div>
                <div>
                  <p className="mb-1" style={{ color: 'var(--text-muted)' }}>Support</p>
                  <p>support@only-works.com</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  required
                  className="input"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  required
                  className="input"
                />
              </div>
              <div>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Message"
                  required
                  rows={4}
                  className="input"
                  style={{ height: 'auto', padding: '16px' }}
                />
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
                {isLoading ? 'Sending...' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Message sent!')
    setFormData({ name: '', email: '', message: '' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/">
            <Image src="/images/logo.png" alt="OnlyWorks" width={32} height={32} className="logo-icon" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/careers" className="nav-link">Careers</Link>
          </div>
          <Link href="/downloads" className="btn btn-primary">
            Access
          </Link>
        </div>
      </nav>

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

      {/* Footer */}
      <footer className="footer">
        <div className="container flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

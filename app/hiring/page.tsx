'use client'

import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Users, CheckCircle, BarChart3, Shield } from 'lucide-react'

export default function HiringPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    job_title: '',
    team_size: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/hiring-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setIsSubmitted(true)
      toast.success('You\'re on the list!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    { icon: CheckCircle, title: 'Verified Work History', desc: 'See candidates\' actual work output, not just what they claim on a resume.' },
    { icon: BarChart3, title: 'Productivity Insights', desc: 'Understand how candidates work — their tools, focus patterns, and output quality.' },
    { icon: Shield, title: 'Trusted Proof', desc: 'Tamper-proof verification that candidates can\'t fake or exaggerate.' },
    { icon: Users, title: 'Team Fit Analysis', desc: 'Evaluate how candidates\' work styles align with your team\'s workflow.' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--accent)' }}>
            Coming Soon
          </p>
          <h1 className="mb-4 md:mb-6">
            Hire with confidence
          </h1>
          <p className="text-lg md:text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Stop guessing. See verified proof of how candidates actually work before you hire them.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4 md:gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="card">
                <div className="icon-wrap mb-4">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h3 className="mb-2">{benefit.title}</h3>
                <p className="text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section className="py-16 md:py-24 px-4 md:px-6" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="mb-3">Join the waitlist</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Be the first to access OnlyWorks for hiring managers.
            </p>
          </div>

          {isSubmitted ? (
            <div className="card text-center py-12">
              <div className="icon-wrap mb-4 mx-auto">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="mb-2">You're on the list!</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                We'll reach out as soon as hiring manager access is available.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                  className="input"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Work email"
                  required
                  className="input"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company"
                  className="input"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  placeholder="Job title"
                  className="input"
                />
              </div>
              <div>
                <select
                  value={formData.team_size}
                  onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                  className="input"
                  style={{ color: formData.team_size ? 'var(--text)' : 'var(--text-muted)' }}
                >
                  <option value="">Team size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
                {isLoading ? 'Joining...' : 'Join waitlist'}
              </button>
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                No spam. We'll only email you when it's ready.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

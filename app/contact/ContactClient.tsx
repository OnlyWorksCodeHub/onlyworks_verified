'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Send, ArrowRight, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GeometricPattern, GridBackground, FloatingParticles } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { BinaryRain, CodeDecoration, WatermarkText, ConnectionLines } from '@/components/ui/decorative-fills'

function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {[12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((t) => (
        <div key={`h-${t}`} className="absolute h-px bg-foreground/10" style={{ top: `${t}%`, left: 0, right: 0 }} />
      ))}
      {[8.33, 16.66, 24.99, 33.32, 41.65, 49.98, 58.31, 66.64, 74.97, 83.3, 91.63, 99.96].map((l) => (
        <div key={`v-${l}`} className="absolute w-px bg-foreground/10" style={{ left: `${l}%`, top: 0, bottom: 0 }} />
      ))}
    </div>
  )
}

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

  const contactMethods = [
    { icon: Mail, label: 'General inquiries', value: 'admin@only-works.com', desc: 'For partnerships, press, and general questions.' },
    { icon: MessageSquare, label: 'Support', value: 'support@only-works.com', desc: 'Technical help and account issues.' },
    { icon: Clock, label: 'Response time', value: 'Within 24 hours', desc: 'Usually a few hours during business days.' },
    { icon: MapPin, label: 'Location', value: 'Remote-first', desc: 'Team distributed across 10+ countries.' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO — left-aligned, v0 hero pattern ═══ */}
      <section className="relative pt-24 lg:pt-28 pb-12 lg:pb-16 overflow-hidden">
        <GridLines />
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50" />
        <BinaryRain />
        <CodeDecoration side="right" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              Contact
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,5.5vw,5rem)] font-display leading-[0.95] tracking-tight mb-12"
          >
            <span className="block">Get in</span>
            <span className="block text-muted-foreground">touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg lg:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
          >
            Questions, feedback, or just want to say hi? We respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* ═══ CONTACT INFO — v0 Metrics 2x2 grid ═══ */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <FloatingParticles count={8} />
        <WatermarkText text="CONTACT" />
        <ConnectionLines className="opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
            {contactMethods.map((method, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-background p-8 lg:p-12 group"
              >
                <div className="w-10 h-10 flex items-center justify-center border border-foreground/10 mb-6 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <method.icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-2">{method.label}</p>
                <div className="text-2xl lg:text-3xl font-display tracking-tight mb-3">
                  {method.value.includes('@') ? (
                    <a href={`mailto:${method.value}`} className="hover:underline underline-offset-4">{method.value}</a>
                  ) : (
                    method.value
                  )}
                </div>
                <p className="text-muted-foreground">{method.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FORM — v0 testimonial pattern (asymmetric 3/5 + 2/5 split) ═══ */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <GridBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left info column — 4 cols */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-4"
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
                Send a message
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
                We&apos;d love to<br />hear from you.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                Whether you have a question about features, pricing, or anything else, our team is ready to answer.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'General', value: 'admin@only-works.com' },
                  { icon: MessageSquare, label: 'Support', value: 'support@only-works.com' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 py-4 border-t border-foreground/10">
                    <div className="w-10 h-10 flex items-center justify-center border border-foreground/10 shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-sm font-medium">
                        <a href={`mailto:${item.value}`} className="hover:underline underline-offset-4">{item.value}</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right form column — 8 cols */}
            <motion.form
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="lg:col-span-8 border border-foreground/10 p-8 lg:p-12 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-muted-foreground mb-2">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Smith"
                    required
                    className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-muted-foreground mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    required
                    className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-mono text-muted-foreground mb-2">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="What's on your mind?"
                  required
                  rows={8}
                  className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all resize-none focus:border-foreground/30"
                />
              </div>
              <ShimmerButton
                shimmerColor="#a78bfa"
                background="rgba(139, 92, 246, 1)"
                borderRadius="1.75rem"
                type="submit"
                disabled={isLoading}
                className="w-full h-14 px-8 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send message'}
              </ShimmerButton>
            </motion.form>
          </div>
        </div>
      </section>

      {/* ═══ CTA — v0 CTA pattern ═══ */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <GeometricPattern className="left-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-20" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-10 lg:py-14">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8 leading-[0.95]">
                  Ready to prove<br />your work?
                </h2>
                <p className="text-lg lg:text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  Download OnlyWorks free. Start building your verified profile today.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link
                    href="/downloads"
                    className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                    style={{ background: '#8b5cf6' }}
                  >
                    Download free
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                  >
                    Help center
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
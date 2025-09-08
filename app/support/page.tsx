'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { HelpCircle, MessageSquare, Mail, Book } from 'lucide-react'

export default function SupportPage() {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Support</h1>
              <p className="text-gray-400 mt-1">Get help with OnlyWorks</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                <Mail className="w-10 h-10 text-[#5E5CE6] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                <p className="text-gray-400 mb-4">Get help via email within 24 hours</p>
                <a href="mailto:support@onlyworks.com" className="text-[#5E5CE6] hover:text-[#4E4CD6]">
                  support@onlyworks.com
                </a>
              </div>
              
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
                <Book className="w-10 h-10 text-[#5E5CE6] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Documentation</h3>
                <p className="text-gray-400 mb-4">Learn how to use OnlyWorks effectively</p>
                <a href="/docs" className="text-[#5E5CE6] hover:text-[#4E4CD6]">
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

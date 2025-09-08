'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { User, Bell, Shield, CreditCard, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadProfile()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    } else {
      setUser(user)
    }
  }

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      setProfile(data)
    }
  }

  const updateProfile = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        company: profile.company,
        profession: profile.profession
      })
      .eq('id', user.id)

    if (!error) {
      toast.success('Profile updated successfully')
    } else {
      toast.error('Failed to update profile')
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 mt-1">Manage your account and preferences</p>
            </div>

            {/* Profile Settings */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <User className="w-5 h-5 text-[#5E5CE6] mr-2" />
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profile.company || ''}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Profession
                  </label>
                  <select
                    value={profile.profession || ''}
                    onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-gray-800 rounded-lg text-white focus:border-[#5E5CE6] focus:outline-none"
                  >
                    <option value="">Select profession</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="marketer">Marketer</option>
                    <option value="writer">Writer</option>
                    <option value="finance">Finance</option>
                    <option value="sales">Sales</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={updateProfile}
                disabled={loading}
                className="mt-6 px-6 py-2 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Subscription */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-5 h-5 text-[#5E5CE6] mr-2" />
                <h2 className="text-xl font-semibold text-white">Subscription</h2>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">Free Plan</p>
                  <p className="text-sm text-gray-400">3 sessions per month</p>
                </div>
                <button className="px-4 py-2 bg-[#5E5CE6] text-white rounded-lg hover:bg-[#4E4CD6] transition">
                  Upgrade to Pro
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Sign Out</h3>
                  <p className="text-sm text-gray-400">End your current session</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

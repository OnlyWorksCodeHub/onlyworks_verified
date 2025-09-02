'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { User, Bell, Shield, Moon, Sun, Camera, Mail, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/lib/contexts/theme-context'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
    bio: '',
    created_at: '',
  })
  const { theme, toggleTheme } = useTheme()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileData) {
      setProfile({
        full_name: profileData.full_name || '',
        email: profileData.email || user.email || '',
        avatar_url: profileData.avatar_url || '',
        bio: profileData.bio || '',
        created_at: profileData.created_at || '',
      })
    }
    
    setLoading(false)
  }

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
        })
        .eq('id', user.id)
      
      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setProfile({ ...profile, avatar_url: publicUrl })
      toast.success('Avatar updated successfully')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light tracking-tighter mb-8">
              Settings
            </h1>
            
            {/* Profile Settings */}
            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer hover:bg-primary-dark">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Profile Picture</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {profile.created_at && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member since {new Date(profile.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
                  </div>
                )}
                
                <button
                  onClick={updateProfile}
                  className="btn-clean btn-primary-clean"
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            {/* Appearance Settings */}
            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <div className="flex items-center mb-4">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                )}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <div className="flex items-center mb-4">
                <Bell className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-gray-700 dark:text-gray-300">Email notifications for weekly reports</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-gray-700 dark:text-gray-300">Productivity insights alerts</span>
                </label>
              </div>
            </div>
            
            {/* Privacy Settings */}
            <div className="bg-white dark:bg-dark-card rounded-sm border border-gray-200 dark:border-dark-border p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Privacy</h2>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-gray-700 dark:text-gray-300">Auto-delete screenshots after 30 days</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">Anonymous usage analytics</span>
                </label>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                  Delete All Data
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

interface UserProfile {
  name?: string
  plan: 'free' | 'unlimited'
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      try {
        // Get current user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !currentUser) {
          router.push('/auth/login')
          return
        }
        
        setUser(currentUser)
        
        // Get profile data from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', currentUser.id)
          .single()
        
        // Get name from auth.users Display name column
        const name = currentUser.user_metadata?.display_name || 
                    currentUser.user_metadata?.name || 
                    currentUser.user_metadata?.full_name || 
                    'Not provided'
        
        setProfile({
          name: name,
          plan: profileData?.plan || 'free'
        })
        
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  const getPlanBadge = () => {
    if (profile.plan === 'unlimited') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          🔓 Unlimited
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-200 text-yellow-900">
        🟡 Free
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-[#FFFFC5]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <img 
                src="/logo_yello.svg" 
                alt="Logo" 
                className="h-8 w-auto"
              />
                              <h1 className="text-2xl font-bold text-gray-900">Account</h1>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <p className="text-lg text-gray-900">
                    {profile.name || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>
              </div>

              {/* Plan */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Plan</label>
                  <div className="mt-2">
                    {getPlanBadge()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-red-50 border-t border-red-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-800">Danger Zone</h3>
                <p className="text-sm text-red-600 mt-1">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete my account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
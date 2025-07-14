'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { getUserDisplayName } from '@/lib/user-utils'
import { Crown } from 'lucide-react'

interface UserProfile {
  display_name?: string
  plan: 'free' | 'unlimited'
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  
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
          .select('plan, display_name')
          .eq('id', currentUser.id)
          .single()
        
        setProfile({
          display_name: profileData?.display_name || await getUserDisplayName(currentUser.id),
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

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Kunde inte starta betalning. Försök igen.')
      }
    } catch (e) {
      alert('Något gick fel. Försök igen.')
    } finally {
      setIsUpgrading(false)
    }
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
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Din plan</h2>
          <div className="mb-4">{getPlanBadge()}</div>
          {profile.plan === 'free' && (
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-md border border-yellow-200 shadow-sm hover:bg-yellow-200 transition-colors disabled:opacity-50 text-sm"
            >
              <Crown className="w-4 h-4 text-yellow-500" />
              {isUpgrading ? 'Loading...' : 'Upgrade to Unlimited'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
} 
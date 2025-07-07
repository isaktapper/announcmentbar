'use client'

import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Plus, Sparkles, Users, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ScribbleUnderline, ScribbleArrow, ScribbleHeart, ScribbleWave } from '../../components/scribbles/ScribbleElements'
import AnnouncementCard from '../../components/dashboard/AnnouncementCard'
import { Announcement } from '../../types/announcement'

interface DashboardClientProps {
  initialAnnouncements: Announcement[]
  user: User
}

export default function DashboardClient({ initialAnnouncements, user }: DashboardClientProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const refreshAnnouncements = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setAnnouncements(data || [])
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const stats = {
    total: announcements.length,
    public: announcements.filter(a => a.visibility === true).length,
    private: announcements.filter(a => a.visibility === false).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                <ScribbleUnderline className="bottom-0 left-0 w-20 h-2 text-purple-400" />
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Make it memorable</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Welcome back, <span className="font-medium">{user.email?.split('@')[0]}</span>!
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="relative mb-12">
          <div className="text-center">
            <div className="relative inline-block">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Your Announcements
              </h2>
              <ScribbleHeart className="top-0 right-0 w-6 h-6 text-pink-400 transform rotate-12" />
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create beautiful announcements that capture attention and drive engagement.
            </p>
            
            {/* Create button */}
            <div className="relative inline-block">
              <button
                onClick={() => router.push('/dashboard/create')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Announcement
              </button>
              <ScribbleArrow className="top-0 -right-8 w-6 h-6 text-blue-400 transform rotate-45" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <ScribbleWave className="bottom-2 left-4 w-8 h-2 text-blue-200 group-hover:text-blue-300 transition-colors" />
          </div>
          
          <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.public}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-600">{stats.private}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-gray-400" />
                </div>
                <ScribbleWave className="bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first announcement to get started!
              </p>
              <button
                onClick={() => router.push('/dashboard/create')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onUpdate={refreshAnnouncements}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/Toast'
import { Announcement } from '@/types/announcement'
import Link from 'next/link'
import AnnouncementCard from './AnnouncementCard'

interface AnnouncementDashboardProps {
  user: User
  initialAnnouncements: Announcement[]
}

export default function AnnouncementDashboard({ 
  user, 
  initialAnnouncements 
}: AnnouncementDashboardProps) {
  const router = useRouter()
  const { toasts, success, error, removeToast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)

  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch {
      error('Error signing out')
    } finally {
      setLoading(false)
    }
  }



  const handleUpdateAnnouncement = (updatedAnnouncement: Announcement) => {
    setAnnouncements(prev => 
      prev.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a)
    )
  }

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  const userMetadata = user.user_metadata || {}
  const firstName = userMetadata.first_name || ''
  const lastName = userMetadata.last_name || ''
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : user.email

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bar Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {fullName}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-brand-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">{announcements.length}</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Bars
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {announcements.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">
                        {announcements.filter(a => a.visibility).length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Bars
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {announcements.filter(a => a.visibility).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">
                        {announcements.filter(a => !a.visibility).length}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Hidden Bars
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {announcements.filter(a => !a.visibility).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="mb-6">
            <Link
              href="/dashboard/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#FFFFC5] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create New Bar
            </Link>
          </div>

          {/* Announcements Grid */}
          {announcements.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="max-w-md mx-auto">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  <PlusIcon className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bars</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first bar.
                </p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-[#FFFFC5] hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create New Bar
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onUpdate={handleUpdateAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                  onSuccess={success}
                  onError={error}
                />
              ))}
            </div>
          )}
        </div>
      </main>



      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
} 
'use client'

import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Plus, Sparkles, BarChart2, CheckCircle, MinusCircle, User as UserIcon, Wrench, Zap, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { ScribbleArrow, ScribbleHeart, ScribbleWave } from '../../components/scribbles/ScribbleElements'
import AnnouncementCard from '../../components/dashboard/AnnouncementCard'
import { Announcement } from '../../types/announcement'
import { getUserPlan, getUserDisplayName } from '@/lib/user-utils'
import { useToast } from '@/hooks/useToast'
import TypeSelectionModal from './components/TypeSelectionModal'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface DashboardClientProps {
  initialAnnouncements: Announcement[]
  user: User
}

export default function DashboardClient({ initialAnnouncements, user }: DashboardClientProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
  const [isLoading, setIsLoading] = useState(false)
  const [userPlan, setUserPlan] = useState<'free' | 'unlimited'>('free')
  const [displayName, setDisplayName] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const router = useRouter()
  const { error } = useToast()
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showUnlimitedModal, setShowUnlimitedModal] = useState(false)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [plan, name] = await Promise.all([
          getUserPlan(user.id),
          getUserDisplayName(user.id, true)
        ])
        setUserPlan(plan)
        setDisplayName(name)
      } catch (error) {
        console.warn('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [user.id])

  // Check for error state from middleware
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorType = params.get('error')
    
    if (errorType === 'free_plan_limit') {
      error("You can only have 1 active bar on the Free plan. Disable one to create another or upgrade your plan.")
      // Remove error from URL without refreshing
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [error])

  // Show Unlimited popup on first login
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('seenUnlimitedPopup')
      if (!seen) {
        setShowUnlimitedModal(true)
        localStorage.setItem('seenUnlimitedPopup', '1')
      }
    }
  }, [])

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

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        error('Kunde inte starta betalning. Försök igen.')
      }
    } catch (e) {
      error('Något gick fel. Försök igen.')
    } finally {
      setIsUpgrading(false)
    }
  }

  const stats = {
    total: announcements.length,
    public: announcements.filter(a => a.visibility === true).length,
    private: announcements.filter(a => a.visibility === false).length,
  }

  const filteredAnnouncements = announcements.filter(announcement => {
    if (activeFilter === 'active') return announcement.visibility === true;
    if (activeFilter === 'inactive') return announcement.visibility === false;
    return true;
  });

  const hasActiveBar = stats.public > 0
  const canCreateNewBar = userPlan === 'unlimited' || !hasActiveBar

  const handleCreateClick = () => {
    if (!canCreateNewBar) {
      error("You can only have 1 active bar on the Free plan. Disable one to create another or upgrade your plan.")
      return
    }
    setIsTypeModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-[#FFFFC5]">
      {/* Unlimited Plan Promo Modal */}
      <Transition.Root show={showUnlimitedModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowUnlimitedModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgba(30,41,59,0.32)] transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                      onClick={() => setShowUnlimitedModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm"><svg className="w-5 h-5 mr-1 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4l2.09 6.26L20 10l-5 3.64L16.18 20 12 16.77 7.82 20 9 13.64 4 10l5.91-.74L12 4z" /></svg>One-time $8</span>
                    </div>
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">Unlock Unlimited</Dialog.Title>
                    <div className="text-lg font-semibold text-gray-900 mb-1">$8 <span className="text-base font-normal text-gray-500">one-time</span></div>
                    <div className="text-gray-600 mb-4">Everything you need, forever</div>
                    <ul className="text-left mb-6 space-y-2">
                      <li className="flex items-center text-gray-800"><span className="text-green-500 mr-2">✔</span> Unlimited bars</li>
                      <li className="flex items-center text-gray-800"><span className="text-green-500 mr-2">✔</span> Templates</li>
                      <li className="flex items-center text-gray-800"><span className="text-green-500 mr-2">✔</span> Premium icons</li>
                      <li className="flex items-center text-gray-800"><span className="text-green-500 mr-2">✔</span> Custom fonts</li>
                      <li className="flex items-center text-gray-800"><span className="text-green-500 mr-2">✔</span> Advanced targeting</li>
                      <li className="flex items-center text-gray-800"><span className="text-green-500 mr-2">✔</span> Scheduled bars</li>
                    </ul>
                    <button
                      className="w-full py-3 bg-yellow-100 text-yellow-800 font-semibold rounded-lg shadow hover:bg-yellow-200 transition-colors text-lg mb-2"
                      onClick={() => { setShowUnlimitedModal(false); if (userPlan === 'free') handleUpgrade(); }}
                    >
                      Get Unlimited
                    </button>
                    <div className="text-sm text-gray-500">Pay once, use forever</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <img 
                src="/logo_yello.svg" 
                alt="Logo" 
                className="h-10 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                Welcome back, <span className="font-medium">{displayName}</span>!
              </div>
              {userPlan === 'free' && (
                <button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 font-medium rounded-md border border-yellow-200 shadow-sm hover:bg-yellow-200 transition-colors disabled:opacity-50 text-sm"
                  title="Upgrade to Unlimited"
                >
                  <Crown className="w-4 h-4 text-yellow-500" />
                  {isUpgrading ? 'Loading...' : 'Upgrade to Unlimited'}
                </button>
              )}
              <button
                onClick={() => router.push('/profile')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Profile"
              >
                <UserIcon className="w-5 h-5" />
              </button>
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
                Your Bars
              </h2>
              <ScribbleHeart className="top-0 right-0 w-6 h-6 text-pink-400 transform rotate-12" />
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create beautiful bars that capture attention and drive engagement.
            </p>
            
            {/* Create button */}
            <div className="space-y-4">
            <div className="relative inline-block">
                <div className="flex items-center gap-3">
              <button
                    onClick={handleCreateClick}
                    className={`inline-flex items-center px-8 py-4 bg-[#FFFFC5] text-black font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${!canCreateNewBar ? 'opacity-50 cursor-not-allowed hover:bg-[#FFFFC5] hover:translate-y-0 hover:shadow-lg' : 'hover:bg-yellow-200'}`}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Bar
              </button>
                  <button
                    onClick={() => window.open('/installation', '_blank')}
                    className="inline-flex items-center px-4 py-4 text-gray-600 hover:text-gray-900 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <Wrench className="w-5 h-5 mr-2" />
                    Installation Guide
                  </button>
                </div>
              <ScribbleArrow className="top-0 -right-8 w-6 h-6 text-brand-400 transform rotate-45" />
              </div>

              {/* Free Plan Limit Info */}
              {!canCreateNewBar && (
                <div className="flex justify-center">
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 max-w-md w-full text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-amber-200 rounded-full p-2 mb-3">
                        <Zap className="w-4 h-4 text-amber-700" />
                      </div>
                      <h4 className="text-base font-semibold text-amber-900 mb-1.5">Ready to Create More Bars?</h4>
                      <p className="text-sm text-amber-800 mb-4">
                        Upgrade to Unlimited for just $8 (one-time payment) and create as many active bars as you need, forever!
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => router.push('/profile')}
                          className="inline-flex items-center px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-amber-600 transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                          <Zap className="w-4 h-4 mr-1.5" />
                          Upgrade to Unlimited
                        </button>
                        <div className="text-xs text-amber-700">
                          or <button onClick={() => router.push('/dashboard')} className="underline hover:text-amber-900">disable an active bar</button> to create a new one
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={() => setActiveFilter('all')}
            className={`relative bg-white rounded-xl p-6 shadow-sm border ${activeFilter === 'all' ? 'border-brand-600 ring-1 ring-brand-600' : 'border-gray-200'} group hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-brand-600" />
              </div>
            </div>
            <ScribbleWave className="bottom-2 left-4 w-8 h-2 text-brand-200 group-hover:text-brand-300 transition-colors" />
          </div>
          
          <div 
            onClick={() => setActiveFilter('active')}
            className={`relative bg-white rounded-xl p-6 shadow-sm border ${activeFilter === 'active' ? 'border-green-600 ring-1 ring-green-600' : 'border-gray-200'} group hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.public}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div 
            onClick={() => setActiveFilter('inactive')}
            className={`relative bg-white rounded-xl p-6 shadow-sm border ${activeFilter === 'inactive' ? 'border-gray-600 ring-1 ring-gray-600' : 'border-gray-200'} group hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-600">{stats.private}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <MinusCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-gray-400" />
                </div>
                <ScribbleWave className="bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bars yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first bar to get started!
              </p>
              <button
                onClick={() => router.push('/dashboard/create')}
                className="inline-flex items-center px-6 py-3 bg-[#FFFFC5] text-black font-medium rounded-lg hover:bg-yellow-200 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Bar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onUpdate={refreshAnnouncements}
                  onDelete={() => refreshAnnouncements()}
                  onSuccess={() => {}}
                  onError={() => {}}
                  userPlan={userPlan}
                  hasActiveBar={userPlan === 'free' && stats.public > 0}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Type Selection Modal */}
      <TypeSelectionModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
      />
      {/* Toast Container */}
      {/* The ToastContainer component is now part of useToast, so it's not needed here. */}
      {/* If you want to customize the toast appearance, you might need to adjust useToast or create a custom component. */}
    </div>
  )
} 
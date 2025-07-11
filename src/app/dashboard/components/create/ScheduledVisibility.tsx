'use client'

import { useState, useEffect } from 'react'
import { getUserPlan } from '@/lib/user-utils'
import { createClient } from '@/lib/supabase-client'

interface ScheduledVisibilityProps {
  startTime: string | null
  endTime: string | null
  onChange: (startTime: string | null, endTime: string | null) => void
}

export default function ScheduledVisibility({ startTime, endTime, onChange }: ScheduledVisibilityProps) {
  const [userPlan, setUserPlan] = useState<'free' | 'unlimited'>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const plan = await getUserPlan(user.id)
          setUserPlan(plan)
        }
      } catch (error) {
        console.warn('Error fetching user plan:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserPlan()
  }, [])

  if (loading) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Schedule when your announcement should automatically go live and expire
        </p>
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Schedule when your announcement should automatically go live and expire
        </p>
      </div>
      <div className={`space-y-4 ${userPlan === 'free' ? 'opacity-50' : ''}`}>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Time (UTC)</label>
          <input
            type="datetime-local"
            value={startTime || ''}
            onChange={(e) => onChange(e.target.value, endTime)}
            disabled={userPlan === 'free'}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Time (UTC)</label>
          <input
            type="datetime-local"
            value={endTime || ''}
            onChange={(e) => onChange(startTime, e.target.value)}
            disabled={userPlan === 'free'}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <p className="text-xs text-gray-500">
          Set when the bar should go live and expire. Time is in UTC.
        </p>
      </div>
    </div>
  )
} 
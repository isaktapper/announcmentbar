'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Crown } from 'lucide-react'
import PageTargeting from './PageTargeting'
import GeoSelector from './GeoSelector'
import ScheduledVisibility from './ScheduledVisibility'
import { getUserPlan } from '@/lib/user-utils'
import { createClient } from '@/lib/supabase-client'

interface TargetingGroupProps {
  pagePaths: string[]
  geoCountries: string[]
  scheduledStart: string | null
  scheduledEnd: string | null
  onPagePathsChange: (paths: string[]) => void
  onGeoCountriesChange: (countries: string[]) => void
  onScheduledTimeChange: (startTime: string | null, endTime: string | null) => void
}

export default function TargetingGroup({
  pagePaths,
  geoCountries,
  scheduledStart,
  scheduledEnd,
  onPagePathsChange,
  onGeoCountriesChange,
  onScheduledTimeChange
}: TargetingGroupProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<'free' | 'unlimited'>('free')

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
      }
    }

    fetchUserPlan()
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const sections = [
    {
      id: 'page',
      title: 'Page Targeting',
      isPremium: true,
      component: (
        <PageTargeting
          pagePaths={pagePaths}
          onChange={onPagePathsChange}
        />
      )
    },
    {
      id: 'geo',
      title: 'Geo Targeting',
      isPremium: true,
      component: (
        <GeoSelector
          selectedCountries={geoCountries}
          onSelect={onGeoCountriesChange}
        />
      )
    },
    {
      id: 'schedule',
      title: 'Scheduled Visibility',
      isPremium: true,
      component: (
        <ScheduledVisibility
          startTime={scheduledStart}
          endTime={scheduledEnd}
          onChange={onScheduledTimeChange}
        />
      )
    }
  ]

  return (
    <div className="space-y-4">
      {sections.map(({ id, title, isPremium, component }) => (
        <div key={id} className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={() => toggleSection(id)}
            className="w-full px-4 py-3 bg-white flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">{title}</span>
            <div className="flex items-center gap-2">
              {isPremium && userPlan === 'free' && (
                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Feature
                </span>
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedSection === id ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </button>
          {expandedSection === id && (
            <div className="px-4 py-3 border-t border-gray-200 bg-white overflow-visible">
              {component}
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 
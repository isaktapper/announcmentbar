'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { getUserPlan } from '@/lib/user-utils'
import { createClient } from '@/lib/supabase-client'

interface PageTargetingProps {
  pagePaths: string[]
  onChange: (paths: string[]) => void
}

type TargetingMode = 'all' | 'includes'

export default function PageTargeting({ pagePaths, onChange }: PageTargetingProps) {
  const [mode, setMode] = useState<TargetingMode>(pagePaths.length > 0 ? 'includes' : 'all')
  const [paths, setPaths] = useState<string[]>(pagePaths.length > 0 ? pagePaths : [''])
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

  const handleModeChange = (newMode: TargetingMode) => {
    setMode(newMode)
    if (newMode === 'all') {
      setPaths([''])
      onChange([])
    } else {
      if (paths.length === 0) {
        setPaths([''])
      }
    }
  }

  const handlePathChange = (index: number, value: string) => {
    const newPaths = [...paths]
    newPaths[index] = value
    setPaths(newPaths)
    
    if (mode === 'includes') {
      onChange(newPaths.filter(path => path.trim() !== ''))
    }
  }

  const handleAddPath = () => {
    setPaths([...paths, ''])
  }

  const handleRemovePath = (index: number) => {
    const newPaths = paths.filter((_, i) => i !== index)
    setPaths(newPaths.length > 0 ? newPaths : [''])
    onChange(newPaths.filter(path => path.trim() !== ''))
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Page Targeting
        </label>
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Control which pages of your website show this announcement bar
        </p>
      </div>

      {/* Radio options */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
              checked={mode === 'all'}
              onChange={() => handleModeChange('all')}
            />
            <span className="ml-2 text-sm text-gray-900">All pages</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
              checked={mode === 'includes'}
              onChange={() => handleModeChange('includes')}
              disabled={userPlan === 'free'}
            />
            <span className="ml-2 text-sm text-gray-900">Specific pages</span>
          </label>
        </div>

        {/* Path inputs */}
        {mode === 'includes' && (
          <div className="space-y-3">
            <div className={`space-y-2 ${userPlan === 'free' ? 'opacity-50' : ''}`}>
              {paths.map((path, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={path}
                      onChange={(e) => handlePathChange(index, e.target.value)}
                      placeholder={index === 0 ? "Example: /products or /dashboard" : "/"}
                      disabled={userPlan === 'free'}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400/60 focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePath(index)}
                    disabled={userPlan === 'free'}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={handleAddPath}
              disabled={userPlan === 'free'}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4 inline-block mr-1" />
              Add Route
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock, 
  X,
  ShoppingCart,
  Lightbulb,
  Sparkles,
  BellRing,
  MessageCircle,
  Megaphone,
  Flame,
  Package,
  FlaskConical,
  Search,
  Grid3X3,
  Crown
} from 'lucide-react'
import { ICONS, IconType } from '@/types/announcement'
import { getUserPlan } from '@/lib/user-utils'
import { createClient } from '@/lib/supabase-client'

interface IconSelectorProps {
  selectedIcon: string
  onSelect: (icon: string) => void
}

const iconComponents = {
  None: X,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  ShoppingCart,
  Lightbulb,
  Sparkles,
  BellRing,
  MessageCircle,
  Megaphone,
  Flame,
  Package,
  FlaskConical,
}

const iconLabels = {
  none: 'No Icon',
  warning: 'Warning',
  alert: 'Alert',
  info: 'Info',
  success: 'Success',
  schedule: 'Schedule',
  shopping: 'Shopping',
  lightbulb: 'Idea',
  sparkles: 'Featured',
  bell: 'Notification',
  message: 'Message',
  megaphone: 'Megaphone',
  flame: 'Hot',
  package: 'Product',
  flask: 'Experiment',
}

// Define popular icons to show first (usually most commonly used)
const popularIcons = ['none', 'info', 'warning', 'success']

// Group icons by category for better organization in modal
const iconCategories = {
  'Basic': ['none', 'info', 'warning', 'alert', 'success', 'schedule'],
  'Business': ['shopping', 'package', 'megaphone', 'message'],
  'Features': ['sparkles', 'lightbulb', 'flame', 'bell', 'flask'],
}

export default function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
  const [showAllIcons, setShowAllIcons] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
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

  // Filter icons based on search term
  const filteredIcons = Object.entries(ICONS).filter(([key]) => {
    if (!searchTerm) return true
    const label = iconLabels[key as IconType]?.toLowerCase() || ''
    return label.includes(searchTerm.toLowerCase()) || key.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const renderIconButton = (key: string, componentName: string, size: 'small' | 'large' = 'small') => {
    const IconComponent = iconComponents[componentName as keyof typeof iconComponents]
    const isSelected = selectedIcon === key
    const isNone = key === 'none'
    const label = iconLabels[key as IconType]
    const isPremium = !['none', 'warning', 'alert', 'info', 'success', 'schedule'].includes(key)
    
    const buttonClass = size === 'large' 
      ? `flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all min-w-[100px] relative ${
          isSelected
            ? 'border-[#ff6b6b] bg-[#ff6b6b]/5 text-[#ff6b6b]'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }`
      : `flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all min-w-[70px] relative ${
          isSelected
            ? 'border-[#ff6b6b] bg-[#ff6b6b]/5 text-[#ff6b6b]'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }`

    const iconSize = size === 'large' ? 'w-8 h-8' : 'w-5 h-5'
    const textSize = size === 'large' ? 'text-sm' : 'text-xs'

    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          onSelect(key)
          if (showAllIcons) setShowAllIcons(false)
        }}
        className={buttonClass}
        title={label}
      >
        {/* Premium badge - only show for free users */}
        {isPremium && userPlan === 'free' && (
          <div className="absolute top-1 right-1 bg-yellow-200 rounded-full p-1">
            <Crown className="w-3 h-3 text-black" />
          </div>
        )}
        
        {isNone ? (
          <div className={`${iconSize} border-2 border-dashed ${isSelected ? 'border-[#ff6b6b]' : 'border-gray-400'} rounded-full flex items-center justify-center`}>
            <X className={`${size === 'large' ? 'w-4 h-4' : 'w-3 h-3'} ${isSelected ? 'text-[#ff6b6b]' : ''}`} />
          </div>
        ) : (
          <IconComponent className={`${iconSize} ${isSelected ? 'stroke-[2.5]' : ''}`} />
        )}
        <span className={`${textSize} font-medium text-center leading-tight`}>
          {label}
        </span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Icon
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[70px] h-[70px] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">
        Icon
      </label>
      
      {/* Popular icons - shown inline */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {popularIcons.map(key => {
          const componentName = ICONS[key as keyof typeof ICONS]
          return renderIconButton(key, componentName, 'small')
        })}
        
        {/* Show all icons button */}
        <button
          type="button"
          onClick={() => setShowAllIcons(true)}
          className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all min-w-[70px]"
        >
          <Grid3X3 className="w-5 h-5" />
          <span className="text-xs font-medium text-center leading-tight">
            Show All
          </span>
        </button>
      </div>

      {/* All icons modal */}
      {showAllIcons && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select an Icon</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  {userPlan === 'free' ? (
                    <>
                  Choose from our collection of icons. Premium icons are marked with 
                  <span className="bg-yellow-200 rounded-full p-1">
                    <Crown className="w-3 h-3 text-black inline" />
                  </span>
                    </>
                  ) : (
                    'Choose from our collection of icons'
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowAllIcons(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm text-gray-900 placeholder:text-gray-500 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Icon grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {searchTerm ? (
                // Show filtered results
                <div className="grid grid-cols-6 gap-3">
                  {filteredIcons.map(([key, componentName]) => 
                    renderIconButton(key, componentName, 'large')
                  )}
                </div>
              ) : (
                // Show categorized icons
                <div className="space-y-6">
                  {Object.entries(iconCategories).map(([category, iconKeys]) => (
                    <div key={category}>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">{category}</h4>
                      <div className="grid grid-cols-6 gap-3">
                        {iconKeys.map(key => {
                          const componentName = ICONS[key as keyof typeof ICONS]
                          return renderIconButton(key, componentName, 'large')
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredIcons.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                  <p>No icons found matching &quot;{searchTerm}&quot;</p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                {userPlan === 'free' && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  💡 Tip: <span className="bg-yellow-200 rounded-full p-0.5">
                    <Crown className="w-2.5 h-2.5 text-black inline" />
                  </span> Premium icons may require an upgraded plan in the future
                </div>
                )}
                <button
                  onClick={() => setShowAllIcons(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
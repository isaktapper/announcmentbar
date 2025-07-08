'use client'

import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { FontFamily } from '@/types/announcement'
import { getUserPlan } from '@/lib/user-utils'
import { createClient } from '@/lib/supabase-client'

interface FontSelectorProps {
  selectedFont: FontFamily
  onSelect: (font: FontFamily) => void
}

// Font definitions with Google Fonts
const FONTS: { [key in FontFamily]: { name: string; cssName: string; isPremium: boolean; fallback: string } } = {
  'Work Sans': { name: 'Work Sans', cssName: 'Work Sans', isPremium: false, fallback: 'sans-serif' },
  'Inter': { name: 'Inter', cssName: 'Inter', isPremium: true, fallback: 'sans-serif' },
  'Lato': { name: 'Lato', cssName: 'Lato', isPremium: true, fallback: 'sans-serif' },
  'Roboto': { name: 'Roboto', cssName: 'Roboto', isPremium: true, fallback: 'sans-serif' },
  'Rubik': { name: 'Rubik', cssName: 'Rubik', isPremium: true, fallback: 'sans-serif' },
  'Poppins': { name: 'Poppins', cssName: 'Poppins', isPremium: true, fallback: 'sans-serif' },
  'Space Grotesk': { name: 'Space Grotesk', cssName: 'Space Grotesk', isPremium: true, fallback: 'sans-serif' },
  'DM Sans': { name: 'DM Sans', cssName: 'DM Sans', isPremium: true, fallback: 'sans-serif' },
  'Playfair Display': { name: 'Playfair Display', cssName: 'Playfair Display', isPremium: true, fallback: 'serif' },
  'Bricolage Grotesque': { name: 'Bricolage Grotesque', cssName: 'Bricolage Grotesque', isPremium: true, fallback: 'sans-serif' },
}

export default function FontSelector({ selectedFont, onSelect }: FontSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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

  const handleFontSelect = (font: FontFamily) => {
    const fontConfig = FONTS[font]
    
    // Check if font is premium and user is on free plan
    if (fontConfig.isPremium && userPlan === 'free') {
      return // Don't allow selection of premium fonts for free users
    }
    
    onSelect(font)
    setIsDropdownOpen(false)
  }

  const getDropdownButtonClass = () => {
    return `w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-gray-900 bg-white hover:bg-gray-50 ${
      isDropdownOpen ? 'ring-2 ring-brand-500 border-transparent' : ''
    }`
  }

  const getFontOptionClass = (font: FontFamily) => {
    const fontConfig = FONTS[font]
    const isSelected = selectedFont === font
    const isDisabled = fontConfig.isPremium && userPlan === 'free'
    
    return `flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-all ${
      isSelected 
        ? 'bg-brand-50 text-brand-700' 
        : isDisabled
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-900 hover:bg-gray-50'
    }`
  }

  const renderFontOption = (font: FontFamily) => {
    const fontConfig = FONTS[font]
    const isSelected = selectedFont === font
    const isDisabled = fontConfig.isPremium && userPlan === 'free'

    return (
      <div
        key={font}
        onClick={() => handleFontSelect(font)}
        className={getFontOptionClass(font)}
        style={{ 
          fontFamily: `'${fontConfig.cssName}', ${fontConfig.fallback}`,
          opacity: isDisabled ? 0.5 : 1
        }}
      >
        <span>{fontConfig.name}</span>
        <div className="flex items-center gap-2">
          {isSelected && !isDisabled && (
            <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
          )}
          {fontConfig.isPremium && userPlan === 'free' && (
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">Premium</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          Typography
        </label>
        <div className="w-full h-12 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={getDropdownButtonClass()}
          style={{ 
            fontFamily: `'${FONTS[selectedFont].cssName}', ${FONTS[selectedFont].fallback}`
          }}
        >
          <span>{FONTS[selectedFont].name}</span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
            {/* Premium upgrade message for free users */}
            {userPlan === 'free' && (
              <div className="p-3 bg-yellow-50 border-b border-yellow-100">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Upgrade to unlock custom fonts</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  One-time payment, $8 • Get access to all premium fonts
                </p>
              </div>
            )}
            
            {/* Font Options */}
            <div className="py-1">
              {Object.keys(FONTS).map(font => renderFontOption(font as FontFamily))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
} 
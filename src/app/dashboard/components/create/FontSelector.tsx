'use client'

import { useState, useEffect } from 'react'
import { Crown } from 'lucide-react'
import { FontFamily } from '@/types/announcement'
import { getUserPlan } from '@/lib/user-utils'
import { createClient } from '@/lib/supabase-client'

interface FontSelectorProps {
  selectedFont: FontFamily
  onSelect: (font: FontFamily) => void
}

// Font definitions with Google Fonts
const fontOptions: Record<FontFamily, {
  name: string;
  cssName: string;
  isPremium: boolean;
  fallback: string;
}> = {
  'Work Sans': { name: 'Work Sans', cssName: 'Work Sans', isPremium: false, fallback: 'sans-serif' },
  'Inter': { name: 'Inter', cssName: 'Inter', isPremium: true, fallback: 'sans-serif' },
  'Roboto': { name: 'Roboto', cssName: 'Roboto', isPremium: true, fallback: 'sans-serif' },
  'Open Sans': { name: 'Open Sans', cssName: 'Open Sans', isPremium: true, fallback: 'sans-serif' },
  'Poppins': { name: 'Poppins', cssName: 'Poppins', isPremium: true, fallback: 'sans-serif' },
  'Lato': { name: 'Lato', cssName: 'Lato', isPremium: true, fallback: 'sans-serif' },
  'DM Sans': { name: 'DM Sans', cssName: 'DM Sans', isPremium: true, fallback: 'sans-serif' },
  'Nunito': { name: 'Nunito', cssName: 'Nunito', isPremium: true, fallback: 'sans-serif' },
  'IBM Plex Sans': { name: 'IBM Plex Sans', cssName: 'IBM+Plex+Sans', isPremium: true, fallback: 'sans-serif' },
  'Space Grotesk': { name: 'Space Grotesk', cssName: 'Space+Grotesk', isPremium: true, fallback: 'sans-serif' }
} as const;

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

  // Load all Google Fonts when dropdown opens
  useEffect(() => {
    if (!isDropdownOpen) return;
    (Object.values(fontOptions) as { cssName: string }[]).forEach(font => {
      const fontId = 'google-font-' + font.cssName.replace(/\s|\+/g, '-').toLowerCase();
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font.cssName.replace(/ /g, '+')}:wght@400;500;600&display=swap`;
        document.head.appendChild(link);
      }
    });
  }, [isDropdownOpen]);

  // Reset to Work Sans if user downgrades from unlimited
  useEffect(() => {
    if (userPlan === 'free' && fontOptions[selectedFont]?.isPremium) {
      onSelect('Work Sans')
    }
  }, [userPlan, selectedFont, onSelect])

  const handleFontSelect = (font: FontFamily) => {
    const fontConfig = fontOptions[font]
    if (!fontConfig) {
      onSelect('Work Sans')
      return
    }
    
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
    const fontConfig = fontOptions[font]
    const isSelected = selectedFont === font
    const isDisabled = fontConfig.isPremium && userPlan === 'free'
    
    return `flex items-center justify-between px-4 py-3 text-sm transition-all ${
      isSelected 
        ? 'bg-gray-900 text-white' 
        : isDisabled
        ? 'text-gray-700 cursor-default'
        : 'text-gray-900 hover:bg-gray-50 cursor-pointer'
    }`
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
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
            fontFamily: fontOptions[selectedFont] 
              ? `'${fontOptions[selectedFont].cssName}', ${fontOptions[selectedFont].fallback}`
              : `'Work Sans', sans-serif`
          }}
        >
          <span>{fontOptions[selectedFont]?.name || 'Work Sans'}</span>
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
            <div className="py-1">
              {(Object.entries(fontOptions) as [FontFamily, typeof fontOptions[FontFamily]][]).map(([font, config]) => (
                <div
                  key={font}
                  onClick={() => handleFontSelect(font)}
                  className={getFontOptionClass(font)}
                  style={{ 
                    fontFamily: `'${config.cssName}', ${config.fallback}`
                  }}
                >
                  <span>{config.name}</span>
                  <div className="flex items-center gap-2">
                    {selectedFont === font && !config.isPremium && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                    {config.isPremium && userPlan === 'free' && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <Crown className="w-4 h-4" />
                        <span className="text-xs">Upgrade to unlimited</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
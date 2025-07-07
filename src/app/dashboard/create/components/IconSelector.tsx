'use client'

import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, X } from 'lucide-react'
import { ICONS, IconType } from '@/types/announcement'

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
}

const iconLabels = {
  none: 'No Icon',
  warning: 'Warning',
  alert: 'Alert',
  info: 'Info',
  success: 'Success',
  schedule: 'Schedule',
}

export default function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">
        Icon
      </label>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Object.entries(ICONS).map(([key, componentName]) => {
          const IconComponent = iconComponents[componentName as keyof typeof iconComponents]
          const isSelected = selectedIcon === key
          const isNone = key === 'none'
          
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-w-[80px] ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isNone ? (
                <div className="w-6 h-6 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </div>
              ) : (
                <IconComponent className="w-6 h-6" />
              )}
              <span className="text-xs font-medium">
                {iconLabels[key as IconType]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
} 
'use client'

import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react'
import { Template, ICONS } from '@/types/announcement'

interface TemplatePickerProps {
  selectedTemplate: string | null
  onSelect: (template: Template) => void
}

const iconComponents = {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
}

const templates: Template[] = [
  {
    id: 'alert',
    name: 'Alert',
    title: 'Important System Alert',
    message: 'We are experiencing some issues. Our team is working to resolve this quickly.',
    icon: 'alert',
    background: '#EF4444',
    textColor: '#FFFFFF',
    useGradient: false,
    isSticky: true,
  },
  {
    id: 'maintenance',
    name: 'Planned Maintenance',
    title: 'Scheduled Maintenance',
    message: 'We will be performing maintenance from 2:00 AM to 4:00 AM UTC. Service may be temporarily unavailable.',
    icon: 'schedule',
    background: '#F59E0B',
    textColor: '#FFFFFF',
    useGradient: false,
    isSticky: true,
  },
  {
    id: 'promo',
    name: 'Promo',
    title: '🎉 Special Offer!',
    message: 'Get 50% off your next purchase. Limited time offer - don\'t miss out!',
    icon: 'success',
    background: '#10B981',
    backgroundGradient: '#059669',
    textColor: '#FFFFFF',
    useGradient: true,
    isSticky: false, // Promo messages might not need to be sticky
  },
]

export default function TemplatePicker({ selectedTemplate, onSelect }: TemplatePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Quick Templates
        </label>
        <p className="text-sm text-gray-500">
          Choose a template to get started quickly
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => {
          const IconComponent = iconComponents[ICONS[template.icon as keyof typeof ICONS] as keyof typeof iconComponents]
          const isSelected = selectedTemplate === template.id
          
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="space-y-3">
                {/* Template Preview */}
                <div
                  className="w-full p-3 rounded-lg text-center text-sm"
                  style={{
                    background: template.useGradient && template.backgroundGradient
                      ? `linear-gradient(135deg, ${template.background}, ${template.backgroundGradient})`
                      : template.background,
                    color: template.textColor,
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium text-xs">{template.title}</span>
                  </div>
                  <div className="text-xs opacity-90 line-clamp-2">
                    {template.message}
                  </div>
                </div>
                
                {/* Template Name */}
                <div className="text-center">
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-indigo-700' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
} 